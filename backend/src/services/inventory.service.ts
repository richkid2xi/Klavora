import { AppError, BusinessError, NotFoundError } from '../errors/AppError';
import prisma from '../libs/prisma';

export class InventoryService {
  async getItems(pharmacyId: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      pharmacyId,
      isActive: true,
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { genericName: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
        { barcode: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.category) {
      where.category = params.category;
    }

    const orderBy: any = {};
    if (params.sortBy) {
      orderBy[params.sortBy] = params.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await prisma.$transaction([
      prisma.inventoryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          genericName: true,
          sku: true,
          barcode: true,
          category: true,
          description: true,
          unitPrice: true,
          costPrice: true,
          reorderLevel: true,
          totalQuantity: true,
          unit: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    return {
      items,
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

  async getItemById(id: string, pharmacyId: string) {
    const item = await prisma.inventoryItem.findFirst({
      where: { id, pharmacyId, isActive: true },
      include: {
        batches: {
          where: { status: 'ACTIVE' },
          orderBy: { expiryDate: 'asc' },
          select: {
            id: true,
            batchNumber: true,
            expiryDate: true,
            remainingQty: true,
            costPrice: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    return item;
  }

  async createItem(pharmacyId: string, data: {
    name: string;
    genericName?: string;
    sku: string;
    barcode?: string;
    category: string;
    description?: string;
    unitPrice: number;
    costPrice: number;
    reorderLevel?: number;
    unit?: string;
    imageUrl?: string;
  }) {
    // Check if SKU already exists
    const existingSku = await prisma.inventoryItem.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new AppError('Item with this SKU already exists', 409, 'CONFLICT');
    }

    // Check if barcode already exists (if provided)
    if (data.barcode) {
      const existingBarcode = await prisma.inventoryItem.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        throw new AppError('Item with this barcode already exists', 409, 'CONFLICT');
      }
    }

    const item = await prisma.inventoryItem.create({
      data: {
        ...data,
        pharmacyId,
        reorderLevel: data.reorderLevel ?? 10,
        unit: data.unit ?? 'unit',
      },
      select: {
        id: true,
        name: true,
        genericName: true,
        sku: true,
        barcode: true,
        category: true,
        description: true,
        unitPrice: true,
        costPrice: true,
        reorderLevel: true,
        totalQuantity: true,
        unit: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return item;
  }

  async updateItem(id: string, pharmacyId: string, data: {
    name?: string;
    genericName?: string;
    category?: string;
    description?: string;
    unitPrice?: number;
    costPrice?: number;
    reorderLevel?: number;
    unit?: string;
    imageUrl?: string;
  }) {
    const item = await prisma.inventoryItem.findFirst({
      where: { id, pharmacyId, isActive: true },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    // Check for SKU uniqueness if being updated
    if (data.sku && data.sku !== item.sku) {
      const existingSku = await prisma.inventoryItem.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        throw new AppError('Item with this SKU already exists', 409, 'CONFLICT');
      }
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        genericName: true,
        sku: true,
        barcode: true,
        category: true,
        description: true,
        unitPrice: true,
        costPrice: true,
        reorderLevel: true,
        totalQuantity: true,
        unit: true,
        imageUrl: true,
        updatedAt: true,
      },
    });

    return updatedItem;
  }

  async deactivateItem(id: string, pharmacyId: string) {
    const item = await prisma.inventoryItem.findFirst({
      where: { id, pharmacyId, isActive: true },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    const deactivatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        sku: true,
        isActive: true,
      },
    });

    return deactivatedItem;
  }

  async getLowStockItems(pharmacyId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: {
        pharmacyId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        totalQuantity: true,
        reorderLevel: true,
        unit: true,
      },
    });

    return items.filter(item => item.totalQuantity <= item.reorderLevel);
  }

  async getExpiringSoon(pharmacyId: string, days: number = 90) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const batches = await prisma.inventoryBatch.findMany({
      where: {
        inventoryItem: { pharmacyId },
        status: 'ACTIVE',
        expiryDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        inventoryItem: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    return batches;
  }

  async searchItems(pharmacyId: string, query: string) {
    const items = await prisma.inventoryItem.findMany({
      where: {
        pharmacyId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { barcode: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
      select: {
        id: true,
        name: true,
        genericName: true,
        sku: true,
        barcode: true,
        category: true,
        unitPrice: true,
        totalQuantity: true,
        unit: true,
      },
    });

    return items;
  }

  async createBatch(itemId: string, pharmacyId: string, data: {
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
    costPrice: number;
    supplierName?: string;
    notes?: string;
  }) {
    // Verify item belongs to pharmacy
    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, pharmacyId, isActive: true },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    // Check if batch number already exists for this item
    const existingBatch = await prisma.inventoryBatch.findUnique({
      where: {
        inventoryItemId_batchNumber: {
          inventoryItemId: itemId,
          batchNumber: data.batchNumber,
        },
      },
    });

    if (existingBatch) {
      throw new AppError('Batch with this number already exists', 409, 'CONFLICT');
    }

    // Create batch and update item quantity in transaction
    const result = await prisma.$transaction(async (tx) => {
      const batch = await tx.inventoryBatch.create({
        data: {
          inventoryItemId: itemId,
          batchNumber: data.batchNumber,
          expiryDate: data.expiryDate,
          quantity: data.quantity,
          remainingQty: data.quantity,
          costPrice: data.costPrice,
          supplierName: data.supplierName,
          notes: data.notes,
        },
        select: {
          id: true,
          batchNumber: true,
          expiryDate: true,
          quantity: true,
          remainingQty: true,
          costPrice: true,
          supplierName: true,
          createdAt: true,
        },
      });

      // Update item total quantity
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          totalQuantity: { increment: data.quantity },
        },
      });

      return batch;
    });

    return result;
  }

  async adjustStock(itemId: string, pharmacyId: string, data: {
    adjustmentType: 'INCREASE' | 'DECREASE';
    quantity: number;
    reason: string;
    batchId?: string;
  }) {
    // Verify item belongs to pharmacy
    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, pharmacyId, isActive: true },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    // If adjusting specific batch
    if (data.batchId) {
      const batch = await prisma.inventoryBatch.findFirst({
        where: {
          id: data.batchId,
          inventoryItemId: itemId,
          status: 'ACTIVE',
        },
      });

      if (!batch) {
        throw new NotFoundError('Batch');
      }

      if (data.adjustmentType === 'DECREASE' && batch.remainingQty < data.quantity) {
        throw new BusinessError('Insufficient quantity in batch');
      }
    } else if (data.adjustmentType === 'DECREASE' && item.totalQuantity < data.quantity) {
      throw new BusinessError('Insufficient total quantity');
    }

    // Perform adjustment in transaction
    const result = await prisma.$transaction(async (tx) => {
      let batchUpdate = null;

      if (data.batchId) {
        const adjustment = data.adjustmentType === 'INCREASE' ? data.quantity : -data.quantity;
        batchUpdate = await tx.inventoryBatch.update({
          where: { id: data.batchId },
          data: {
            remainingQty: { increment: adjustment },
          },
        });
      }

      // Update item total quantity
      const adjustment = data.adjustmentType === 'INCREASE' ? data.quantity : -data.quantity;
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          totalQuantity: { increment: adjustment },
        },
      });

      return {
        itemId,
        batchId: data.batchId,
        adjustmentType: data.adjustmentType,
        quantity: data.quantity,
        reason: data.reason,
        newBatchQty: batchUpdate?.remainingQty,
        newTotalQty: item.totalQuantity + adjustment,
      };
    });

    return result;
  }

  async getBatchHistory(itemId: string, pharmacyId: string) {
    // Verify item belongs to pharmacy
    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, pharmacyId },
    });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    const batches = await prisma.inventoryBatch.findMany({
      where: { inventoryItemId: itemId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        batchNumber: true,
        expiryDate: true,
        quantity: true,
        remainingQty: true,
        costPrice: true,
        supplierName: true,
        receivedDate: true,
        notes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return batches;
  }
}