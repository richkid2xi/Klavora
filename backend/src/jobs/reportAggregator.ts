import cron from 'node-cron';
import prisma from '../libs/prisma';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export function startReportAggregator(): void {
  // Run daily at 01:00 UTC
  cron.schedule('0 1 * * *', async () => {
    console.log('📊 Running report aggregator...');

    try {
      const pharmacies = await prisma.pharmacy.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
      });

      for (const pharmacy of pharmacies) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get yesterday's transactions
        const transactions = await prisma.transaction.findMany({
          where: {
            pharmacyId: pharmacy.id,
            type: 'SALE',
            status: 'PAID',
            createdAt: {
              gte: yesterday,
              lt: today,
            },
          },
        });

        // Calculate aggregated metrics
        let totalRevenue = 0;
        let totalCost = 0;
        let totalItemsSold = 0;

        for (const tx of transactions) {
          totalRevenue += Number(tx.totalAmount);
          
          // Get transaction items for cost calculation
          const items = await prisma.transactionItem.findMany({
            where: { transactionId: tx.id },
          });
          
          for (const item of items) {
            totalItemsSold += item.quantity;
            totalCost += item.quantity * Number(item.costPrice);
          }
        }

        const grossProfit = totalRevenue - totalCost;

        // Store aggregated report
        await prisma.report.create({
          data: {
            pharmacyId: pharmacy.id,
            type: 'DAILY_SUMMARY',
            title: `Daily Summary - ${yesterday.toISOString().split('T')[0]}`,
            dateFrom: yesterday,
            dateTo: today,
            data: {
              totalTransactions: transactions.length,
              totalRevenue,
              totalCost,
              grossProfit,
              totalItemsSold,
              averageTransactionValue: transactions.length > 0 
                ? totalRevenue / transactions.length 
                : 0,
            },
          },
        });

        // Invalidate dashboard cache
        await dashboardService.invalidateCache(pharmacy.id);
      }

      console.log('✅ Report aggregation complete');
    } catch (error) {
      console.error('❌ Report aggregator error:', error);
    }
  });
}