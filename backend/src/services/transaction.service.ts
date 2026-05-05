import { AppError, NotFoundError, BusinessError } from '../errors/AppError';
import prisma from '../libs/prisma';
import { generateReferenceNumber } from '../utils/referenceGenerator';

export class TransactionService {
  async getTransactions(pharmacyId: string, params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      pharmacyId,
    };

    if (params.type) {
      where.type = params.type;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) {
        where.createdAt.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        where.createdAt.lte = new Date(params.dateTo);
      }
    }

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              inventoryItem: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      items: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getTransactionById(id: string, pharmacyId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, pharmacyId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            inventoryItem: {
              select: {
                id: true,
                name: true,
                sku: true,
                barcode: true,
                category: true,
                unit: true,
              },
            },
            batch: {
              select: {
                id: true,
                batchNumber: true,
                expiryDate: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction');
    }

    return transaction;
  }

  async createTransaction(
    pharmacyId: string,
    userId: string,
    data: {
      type: 'SALE' | 'PURCHASE' | 'RETURN' | 'ADJUSTMENT';
      items: {
        inventoryItemId: string;
        quantity: number;
        unitPrice: number;
        costPrice: number;
        discount?: number;
        tax?: number;
      }[];
      paymentMethod?: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'INSURANCE';
      customerName?: string;
      customerPhone?: string;
      notes?: string;
    }
  ) {
    // Verify user belongs to pharmacy
    const user = await prisma.user.findFirst({
      where: { id: userId, pharmacyId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const transactionItems = [];

    for (const item of data.items) {
      const inventoryItem = await prisma.inventoryItem.findFirst({
        where: { id: item.inventoryItemId, pharmacyId, isActive: true },
      });

      if (!inventoryItem) {
        throw new NotFoundError(`Inventory item: ${item.inventoryItemId}`);
      }

      // For SALE/DISPENSE, check stock availability
      if (data.type === 'SALE' || data.type === 'DISPENSE') {
        if (inventoryItem.totalQuantity < item.quantity) {
          throw new BusinessError(`Insufficient stock for item: ${inventoryItem.name}`);
        }
      }

      const discount = item.discount ?? 0;
      const tax = item.tax ?? 0;
      const itemTotal = (item.unitPrice * item.quantity) - discount + tax;
      subtotal += itemTotal;

      transactionItems.push({
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        discount: discount,
        tax: tax,
        total: itemTotal,
      });
    }

    // Generate reference number
    const referenceNumber = await generateReferenceNumber(
      pharmacyId,
      data.type
    );

    // Process transaction in a single atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          pharmacyId,
          userId,
          referenceNumber,
          type: data.type,
          status: 'PAID',
          paymentStatus: data.paymentMethod ? 'PAID' : 'PENDING',
          subtotal,
          discount: 0,
          tax: 0,
          totalAmount: subtotal,
          paymentMethod: data.paymentMethod,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          notes: data.notes,
        },
        select: {
          id: true,
          referenceNumber: true,
          type: true,
          status: true,
          subtotal: true,
          totalAmount: true,
          paymentMethod: true,
          paymentStatus: true,
          customerName: true,
          customerPhone: true,
          createdAt: true,
        },
      });

      // Process each item
      for (let i = 0; i < transactionItems.length; i++) {
        const item = transactionItems[i];
        const inventoryItem = await tx.inventoryItem.findUnique({
          where: { id: item.inventoryItemId },
        });

        // For SALE/DISPENSE, deduct stock using FEFO
        if (data.type === 'SALE' || data.type === 'DISPENSE') {
          let remainingQty = item.quantity;

          // Get batches ordered by expiry date (FEFO)
          const batches = await tx.inventoryBatch.findMany({
            where: {
              inventoryItemId: item.inventoryItemId,
              status: 'ACTIVE',
              remainingQty: { gt: 0 },
            },
            orderBy: { expiryDate: 'asc' },
          });

          for (const batch of batches) {
            if (remainingQty <= 0) break;

            const deductQty = Math.min(batch.remainingQty, remainingQty);

            // Update batch quantity
            await tx.inventoryBatch.update({
              where: { id: batch.id },
              data: {
                remainingQty: { decrement: deductQty },
              },
            });

            // Create transaction item with batch reference
            await tx.transactionItem.create({
              data: {
                transactionId: transaction.id,
                inventoryItemId: item.inventoryItemId,
                batchId: batch.id,
                quantity: deductQty,
                unitPrice: item.unitPrice,
                costPrice: item.costPrice,
                discount: item.discount,
                tax: item.tax,
                total: (item.unitPrice * deductQty) - (item.discount ?? 0) + (item.tax ?? 0),
              },
            });

            remainingQty -= deductQty;
          }

          // Update item total quantity
          await tx.inventoryItem.update({
            where: { id: item.inventoryItemId },
            data: {
              totalQuantity: { decrement: item.quantity },
            },
          });
        } else if (data.type === 'PURCHASE' || data.type === 'RETURN') {
          // For PURCHASE/RETURN, add stock
          await tx.transactionItem.create({
            data: {
              transactionId: transaction.id,
              inventoryItemId: item.inventoryItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              costPrice: item.costPrice,
              discount: item.discount,
              tax: item.tax,
              total: item.total,
            },
          });

          await tx.inventoryItem.update({
            where: { id: item.inventoryItemId },
            data: {
              totalQuantity: { increment: item.quantity },
            },
          });
        }
      }

      // Get complete transaction with items
      const completeTransaction = await tx.transaction.findUnique({
        where: { id: transaction.id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              inventoryItem: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      });

      return completeTransaction;
    });

    return result;
  }

  async updatePaymentStatus(
    id: string,
    pharmacyId: string,
    status: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED'
  ) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, pharmacyId, status: { not: 'VOIDED' } },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        paymentStatus: status,
        status: status === 'PAID' ? 'PAID' : 'PENDING',
      },
      select: {
        id: true,
        referenceNumber: true,
        paymentStatus: true,
        status: true,
      },
    });

    return updatedTransaction;
  }

  async voidTransaction(id: string, pharmacyId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, pharmacyId, status: { not: 'VOIDED' } },
      include: {
        items: true,
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction');
    }

    // Reverse stock movements
    const result = await prisma.$transaction(async (tx) => {
      // Reverse stock for each item
      for (const item of transaction.items) {
        // Add quantity back to item
        await tx.inventoryItem.update({
          where: { id: item.inventoryItemId },
          data: {
            totalQuantity: { increment: item.quantity },
          },
        });

        // If batch was specified, add back to batch
        if (item.batchId) {
          await tx.inventoryBatch.update({
            where: { id: item.batchId },
            data: {
              remainingQty: { increment: item.quantity },
            },
          });
        }
      }

      // Mark transaction as voided
      const voidedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          status: 'VOIDED',
          voidedAt: new Date(),
          voidedBy: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              inventoryItem: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      });

      return voidedTransaction;
    });

    return result;
  }

  async getRecentTransactions(pharmacyId: string, limit: number = 10) {
    const transactions = await prisma.transaction.findMany({
      where: { pharmacyId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return transactions;
  }
}