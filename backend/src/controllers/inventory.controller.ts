import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { page, limit, search, category, sortBy, sortOrder } = req.query;

      const result = await inventoryService.getItems(pharmacyId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        category: category as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const item = await inventoryService.getItemById(id, pharmacyId);

      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const item = await inventoryService.createItem(pharmacyId, req.body);

      res.status(201).json({
        success: true,
        data: item,
        message: 'Inventory item created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const item = await inventoryService.updateItem(id, pharmacyId, req.body);

      res.json({
        success: true,
        data: item,
        message: 'Inventory item updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const item = await inventoryService.deactivateItem(id, pharmacyId);

      res.json({
        success: true,
        data: item,
        message: 'Inventory item deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const items = await inventoryService.getLowStockItems(pharmacyId);

      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async getExpiringSoon(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { days } = req.query;
      const batches = await inventoryService.getExpiringSoon(pharmacyId, days ? Number(days) : undefined);

      res.json({ success: true, data: batches });
    } catch (error) {
      next(error);
    }
  }

  async searchItems(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { q } = req.query;
      if (!q) throw new Error('Search query required');

      const items = await inventoryService.searchItems(pharmacyId, q as string);

      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async createBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const batch = await inventoryService.createBatch(id, pharmacyId, {
        ...req.body,
        expiryDate: new Date(req.body.expiryDate),
      });

      res.status(201).json({
        success: true,
        data: batch,
        message: 'Batch created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const result = await inventoryService.adjustStock(id, pharmacyId, req.body);

      res.json({
        success: true,
        data: result,
        message: 'Stock adjusted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const batches = await inventoryService.getBatchHistory(id, pharmacyId);

      res.json({ success: true, data: batches });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();