import { getRedisClient } from '../libs/redis';
import prisma from '../libs/prisma';

const DASHBOARD_CACHE_TTL = 300; // 5 minutes

export class DashboardService {
  async getStats(pharmacyId: string) {
    const redis = getRedisClient();
    const cacheKey = `dashboard:stats:${pharmacyId}`;

    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalItems, todaySales, todayTransactions, unreadAlerts, lowStockItems] = await Promise.all([
      // Total active items
      prisma.inventoryItem.count({
        where: { pharmacyId, isActive: true },
      }),

      // Today's sales total
      prisma.transaction.aggregate({
        where: {
          pharmacyId,
          type: 'SALE',
          status: 'PAID',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Today's transaction count
      prisma.transaction.count({
        where: {
          pharmacyId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Unread alerts count
      prisma.alert.count({
        where: {
          pharmacyId,
          status: { not: 'RESOLVED' },
        },
      }),

      // Low stock items count
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count 
        FROM "InventoryItem" 
        WHERE "pharmacyId" = ${pharmacyId} 
        AND "isActive" = true 
        AND "totalQuantity" <= "reorderLevel"
      `,
    ]);

    // Calculate inventory values
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { pharmacyId, isActive: true },
      select: {
        totalQuantity: true,
        costPrice: true,
        unitPrice: true,
      },
    });

    const totalInventoryValue = inventoryItems.reduce(
      (sum, item) => sum + Number(item.costPrice) * item.totalQuantity,
      0
    );

    const totalRetailValue = inventoryItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.totalQuantity,
      0
    );

    const lowStockCount = Number(lowStockItems[0]?.count || 0);
    const outOfStockCount = inventoryItems.filter(item => item.totalQuantity === 0).length;

    const stats = {
      totalItems,
      totalInventoryValue,
      totalRetailValue,
      todaySales: todaySales._sum.totalAmount || 0,
      todayTransactions,
      unreadAlerts,
      lowStockCount,
      outOfStockCount,
    };

    // Cache the result
    await redis.setex(cacheKey, DASHBOARD_CACHE_TTL, JSON.stringify(stats));

    return stats;
  }

  async getSalesChart(pharmacyId: string, dateFrom?: string, dateTo?: string) {
    const from = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = dateTo ? new Date(dateTo) : new Date();

    const sales = await prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        pharmacyId,
        type: 'SALE',
        status: 'PAID',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date
    const salesMap = new Map<string, { total: number; count: number }>();
    
    sales.forEach((item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      const current = salesMap.get(date) || { total: 0, count: 0 };
      salesMap.set(date, {
        total: current.total + (item._sum.totalAmount || 0),
        count: current.count + item._count.id,
      });
    });

    // Fill in missing dates
    const result = [];
    const currentDate = new Date(from);
    while (currentDate <= to) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const data = salesMap.get(dateStr) || { total: 0, count: 0 };
      result.push({
        date: dateStr,
        total: data.total,
        count: data.count,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  async getTopProducts(pharmacyId: string, params: {
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'quantity' | 'revenue';
  }) {
    const limit = params.limit || 10;
    const from = params.dateFrom ? new Date(params.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = params.dateTo ? new Date(params.dateTo) : new Date();

    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          pharmacyId,
          type: 'SALE',
          status: 'PAID',
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      },
      include: {
        inventoryItem: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            unit: true,
          },
        },
      },
    });

    // Aggregate by item
    const itemStats = new Map<string, {
      item: any;
      quantity: number;
      revenue: number;
    }>();

    transactionItems.forEach((ti) => {
      const current = itemStats.get(ti.inventoryItemId) || {
        item: ti.inventoryItem,
        quantity: 0,
        revenue: 0,
      };
      itemStats.set(ti.inventoryItemId, {
        item: current.item,
        quantity: current.quantity + ti.quantity,
        revenue: current.revenue + Number(ti.total),
      });
    });

    // Sort and return top N
    const sorted = Array.from(itemStats.values())
      .sort((a, b) => {
        if (params.sortBy === 'quantity') {
          return b.quantity - a.quantity;
        }
        return b.revenue - a.revenue;
      })
      .slice(0, limit);

    return sorted.map((s) => ({
      id: s.item.id,
      name: s.item.name,
      sku: s.item.sku,
      category: s.item.category,
      unit: s.item.unit,
      quantitySold: s.quantity,
      revenue: s.revenue,
    }));
  }

  async invalidateCache(pharmacyId: string) {
    const redis = getRedisClient();
    await redis.del(`dashboard:stats:${pharmacyId}`);
  }
}