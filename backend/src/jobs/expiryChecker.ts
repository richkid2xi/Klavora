import cron from 'node-cron';
import prisma from '../libs/prisma';
import { AlertService } from '../services/alert.service';
import { sendExpiryAlert } from '../libs/mailer';

const alertService = new AlertService();

export function startExpiryChecker(): void {
  // Run daily at 00:30 UTC
  cron.schedule('30 0 * * *', async () => {
    console.log('🔍 Running expiry checker...');

    try {
      const pharmacies = await prisma.pharmacy.findMany({
        where: { isActive: true },
        select: { id: true, name: true, expiryAlertDays: true },
      });

      for (const pharmacy of pharmacies) {
        const today = new Date();
        const alertWindow = pharmacy.expiryAlertDays || 90;
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + alertWindow);

        // Find expired batches
        const expiredBatches = await prisma.inventoryBatch.findMany({
          where: {
            inventoryItem: { pharmacyId: pharmacy.id },
            status: 'ACTIVE',
            expiryDate: { lt: today },
          },
          include: {
            inventoryItem: { select: { name: true, id: true, sku: true } },
          },
        });

        // Process expired batches
        for (const batch of expiredBatches) {
          // Create EXPIRED alert if not exists
          const existingExpiredAlert = await prisma.alert.findFirst({
            where: {
              pharmacyId: pharmacy.id,
              batchId: batch.id,
              type: 'EXPIRED',
              status: { not: 'RESOLVED' },
            },
          });

          if (!existingExpiredAlert) {
            await alertService.createAlert({
              pharmacyId: pharmacy.id,
              type: 'EXPIRED',
              severity: 'CRITICAL',
              title: 'Item Expired',
              message: `${batch.inventoryItem.name} (Batch: ${batch.batchNumber}) has expired on ${batch.expiryDate.toLocaleDateString()}`,
              inventoryItemId: batch.inventoryItemId,
              batchId: batch.id,
            });
          }

          // Mark batch as expired and update inventory quantity
          await prisma.$transaction([
            prisma.inventoryBatch.update({
              where: { id: batch.id },
              data: { status: 'EXPIRED' },
            }),
            prisma.inventoryItem.update({
              where: { id: batch.inventoryItemId },
              data: {
                totalQuantity: { decrement: batch.remainingQty },
              },
            }),
          ]);
        }

        // Find batches expiring soon
        const expiringBatches = await prisma.inventoryBatch.findMany({
          where: {
            inventoryItem: { pharmacyId: pharmacy.id },
            status: 'ACTIVE',
            expiryDate: {
              gte: today,
              lte: futureDate,
            },
          },
          include: {
            inventoryItem: { select: { name: true, id: true, sku: true } },
          },
          orderBy: { expiryDate: 'asc' },
        });

        // Create alerts for expiring soon batches
        const expiringItems = new Map<string, typeof expiringBatches[0]>();
        
        for (const batch of expiringBatches) {
          const existingAlert = await prisma.alert.findFirst({
            where: {
              pharmacyId: pharmacy.id,
              batchId: batch.id,
              type: 'EXPIRY_APPROACHING',
              status: { not: 'RESOLVED' },
            },
          });

          if (!existingAlert) {
            const daysUntilExpiry = Math.ceil(
              (new Date(batch.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            await alertService.createAlert({
              pharmacyId: pharmacy.id,
              type: 'EXPIRY_APPROACHING',
              severity: daysUntilExpiry <= 30 ? 'CRITICAL' : 'WARNING',
              title: 'Expiry Warning',
              message: `${batch.inventoryItem.name} (Batch: ${batch.batchNumber}) expires in ${daysUntilExpiry} days`,
              inventoryItemId: batch.inventoryItemId,
              batchId: batch.id,
            });
          }

          // Track unique items for email
          if (!expiringItems.has(batch.inventoryItemId)) {
            expiringItems.set(batch.inventoryItemId, batch);
          }
        }

        // Send email notification to admins and pharmacists
        const recipients = await prisma.user.findMany({
          where: {
            pharmacyId: pharmacy.id,
            role: { in: ['ADMIN', 'PHARMACIST'] },
            isActive: true,
          },
          select: { email: true },
        });

        const itemsList = Array.from(expiringItems.values()).map(batch => ({
          name: batch.inventoryItem.name,
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate,
        }));

        if (itemsList.length > 0 && recipients.length > 0) {
          for (const recipient of recipients) {
            await sendExpiryAlert(recipient.email, itemsList);
          }
        }
      }

      console.log('✅ Expiry check complete');
    } catch (error) {
      console.error('❌ Expiry checker error:', error);
    }
  });
}