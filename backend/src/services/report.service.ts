import { AppError } from '../errors/AppError';
import prisma from '../libs/prisma';

export class ReportService {
  async getSalesReport(pharmacyId: string, params: {
    dateFrom: string;
    dateTo: string;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    const dateFrom = new Date(params.dateFrom);
    const dateTo = new Date(params.dateTo);

    const transactions = await prisma.transaction.findMany({
      where: {
        pharmacyId,
        type: 'SALE',
        status: 'PAID',
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        items: {
          include: {
            inventoryItem: {
              select: {
                category: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalItems = 0;
    const categoryRevenue = new Map<string, number>();
    const userSales = new Map<string, { userId: string; name: string; count: number; revenue: number }>();

    transactions.forEach((tx) => {
      totalRevenue += Number(tx.totalAmount);
      totalDiscount += Number(tx.discount);
      totalTax += Number(tx.tax);

      tx.items.forEach((item) => {
        totalItems += item.quantity;

        // Category breakdown
        const category = item.inventoryItem.category || 'Unknown';
        categoryRevenue.set(
          category,
          (categoryRevenue.get(category) || 0) + Number(item.total)
        );

        // User breakdown
        const userKey = tx.userId;
        const userName = `${tx.user.firstName} ${tx.user.lastName}`;
        const currentUserSales = userSales.get(userKey) || {
          userId: tx.userId,
          name: userName,
          count: 0,
          revenue: 0,
        };
        userSales.set(userKey, {
          ...currentUserSales,
          count: currentUserSales.count + 1,
          revenue: currentUserSales.revenue + Number(tx.totalAmount),
        });
      });
    });

    return {
      summary: {
        totalRevenue,
        totalDiscount,
        totalTax,
        totalItems,
        totalTransactions: transactions.length,
      },
      byCategory: Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
        category,
        revenue,
      })),
      byUser: Array.from(userSales.values()),
      transactions: transactions.map((tx) => ({
        id: tx.id,
        referenceNumber: tx.referenceNumber,
        date: tx.createdAt,
        totalAmount: tx.totalAmount,
        paymentMethod: tx.paymentMethod,
        customerName: tx.customerName,
        items: tx.items.length,
      })),
    };
  }

  async getInventoryReport(pharmacyId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: {
        pharmacyId,
        isActive: true,
      },
      include: {
        batches: {
          where: { status: 'ACTIVE' },
          select: {
            remainingQty: true,
            costPrice: true,
          },
        },
      },
    });

    const inventory = items.map((item) => {
      const totalQty = item.totalQuantity;
      const costValue = totalQty * Number(item.costPrice);
      const retailValue = totalQty * Number(item.unitPrice);
      const totalBatches = item.batches.length;
      const totalBatchQty = item.batches.reduce((sum, b) => sum + b.remainingQty, 0);

      return {
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        unit: item.unit,
        quantity: totalQty,
        costPrice: item.costPrice,
        unitPrice: item.unitPrice,
        costValue,
        retailValue,
        profitMargin: retailValue > 0 ? ((retailValue - costValue) / retailValue) * 100 : 0,
        reorderLevel: item.reorderLevel,
        batches: totalBatches,
        batchesQty: totalBatchQty,
      };
    });

    const totalCostValue = inventory.reduce((sum, item) => sum + item.costValue, 0);
    const totalRetailValue = inventory.reduce((sum, item) => sum + item.retailValue, 0);
    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: inventory,
      summary: {
        totalItems: inventory.length,
        totalQuantity,
        totalCostValue,
        totalRetailValue,
        totalProfit: totalRetailValue - totalCostValue,
      },
    };
  }

  async getExpiryReport(pharmacyId: string, params: {
    days?: number;
  }) {
    const days = params.days || 90;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7); // Past week for expired items

    const [expired, expiringSoon, healthy] = await Promise.all([
      // Expired batches
      prisma.inventoryBatch.findMany({
        where: {
          inventoryItem: { pharmacyId },
          status: 'ACTIVE',
          expiryDate: { lt: today },
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
        orderBy: { expiryDate: 'asc' },
      }),

      // Expiring soon (within the window)
      prisma.inventoryBatch.findMany({
        where: {
          inventoryItem: { pharmacyId },
          status: 'ACTIVE',
          expiryDate: {
            gte: today,
            lte: futureDate,
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
        orderBy: { expiryDate: 'asc' },
      }),

      // Healthy batches (expiring after window)
      prisma.inventoryBatch.count({
        where: {
          inventoryItem: { pharmacyId },
          status: 'ACTIVE',
          expiryDate: { gt: futureDate },
        },
      }),
    ]);

    const expiredValue = expired.reduce((sum, batch) => {
      return sum + batch.remainingQty * Number(batch.costPrice);
    }, 0);

    const expiringSoonValue = expiringSoon.reduce((sum, batch) => {
      return sum + batch.remainingQty * Number(batch.costPrice);
    }, 0);

    return {
      expired: expired.map((b) => ({
        batchId: b.id,
        batchNumber: b.batchNumber,
        itemName: b.inventoryItem.name,
        itemSku: b.inventoryItem.sku,
        category: b.inventoryItem.category,
        unit: b.inventoryItem.unit,
        quantity: b.remainingQty,
        costPrice: b.costPrice,
        expiryDate: b.expiryDate,
        value: b.remainingQty * Number(b.costPrice),
      })),
      expiringSoon: expiringSoon.map((b) => ({
        batchId: b.id,
        batchNumber: b.batchNumber,
        itemName: b.inventoryItem.name,
        itemSku: b.inventoryItem.sku,
        category: b.inventoryItem.category,
        unit: b.inventoryItem.unit,
        quantity: b.remainingQty,
        costPrice: b.costPrice,
        expiryDate: b.expiryDate,
        daysUntilExpiry: Math.ceil(
          (new Date(b.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
        value: b.remainingQty * Number(b.costPrice),
      })),
      summary: {
        expiredCount: expired.length,
        expiredValue,
        expiringSoonCount: expiringSoon.length,
        expiringSoonValue,
        healthyCount: healthy,
      },
    };
  }

  async getProfitLossReport(pharmacyId: string, params: {
    dateFrom: string;
    dateTo: string;
  }) {
    const dateFrom = new Date(params.dateFrom);
    const dateTo = new Date(params.dateTo);

    const transactions = await prisma.transaction.findMany({
      where: {
        pharmacyId,
        type: 'SALE',
        status: 'PAID',
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        items: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalCost = 0;

    transactions.forEach((tx) => {
      tx.items.forEach((item) => {
        totalRevenue += Number(item.total);
        totalCost += item.quantity * Number(item.costPrice);
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      summary: {
        totalRevenue,
        totalCost,
        grossProfit,
        profitMargin: profitMargin.toFixed(2),
      },
      period: {
        from: dateFrom,
        to: dateTo,
      },
    };
  }
}