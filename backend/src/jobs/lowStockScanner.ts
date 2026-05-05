import cron from 'node-cron';
import prisma from '../libs/prisma';
import { AlertService } from '../services/alert.service';
import { sendLowStockAlert } from '../libs/mailer';

const alertService = new AlertService();

export function startLowStockScanner(): void {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Running low stock scanner...');
    
    try {
      const pharmacies = await prisma.pharmacy.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
      });

      for (const pharmacy of pharmacies) {
        // Get all low stock items
        const lowStockItems = await prisma.$queryRaw<any[]>`
          SELECT i.id, i.name, i."totalQuantity", i."reorderLevel", i."pharmacyId"
          FROM "InventoryItem" i
          WHERE i."pharmacyId" = ${pharmacy.id}
          AND i."isActive" = true
          AND i."totalQuantity" <= i."reorderLevel"
        `;

        for (const item of lowStockItems) {
          const severity = item.totalQuantity === 0 ? 'CRITICAL' 
            : item.totalQuantity <= item.reorderLevel * 0.5 ? 'WARNING' 
            : 'INFO';

          const type = item.totalQuantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';

          // Check if alert already exists
          const existingAlert = await prisma.alert.findFirst({
            where: {
              pharmacyId: pharmacy.id,
              inventoryItemId: item.id,
              type,
              status: { not: 'RESOLVED' },
            },
          });

          if (!existingAlert) {
            // Create new alert
            await alertService.createAlert({
              pharmacyId: pharmacy.id,
              type,
              severity,
              title: type === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock Alert',
              message: `${item.name} is ${type === 'OUT_OF_STOCK' ? 'out of stock' : `running low (${item.totalQuantity} remaining)`}. Reorder level: ${item.reorderLevel}`,
              inventoryItemId: item.id,
            });
          }

          // Resolve alerts if stock is now above reorder level
          const resolvedAlerts = await prisma.alert.findMany({
            where: {
              pharmacyId: pharmacy.id,
              inventoryItemId: item.id,
              type,
              status: { in: ['UNREAD', 'READ'] },
            },
          });

          if (item.totalQuantity > item.reorderLevel && resolvedAlerts.length > 0) {
            for (const alert of resolvedAlerts) {
              await prisma.alert.update({
                where: { id: alert.id },
                data: { status: 'RESOLVED' },
              });
            }
          }
        }

        // Send email notification to admins
        const admins = await prisma.user.findMany({
          where: {
            pharmacyId: pharmacy.id,
            role: 'ADMIN',
            isActive: true,
          },
          select: { email: true },
        });

        if (lowStockItems.length > 0 && admins.length > 0) {
          const items = lowStockItems.map(item => ({
            name: item.name,
            quantity: Number(item.totalQuantity),
            reorderLevel: Number(item.reorderLevel),
          }));

          for (const admin of admins) {
            await sendLowStockAlert(admin.email, items);
          }
        }
      }

      console.log('✅ Low stock scan complete');
    } catch (error) {
      console.error('❌ Low stock scanner error:', error);
    }
  });
}