import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const stats = await dashboardService.getStats(pharmacyId);

      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getSalesChart(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { dateFrom, dateTo } = req.query;

      const data = await dashboardService.getSalesChart(
        pharmacyId,
        dateFrom as string,
        dateTo as string
      );

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { limit, dateFrom, dateTo, sortBy } = req.query;

      const products = await dashboardService.getTopProducts(pharmacyId, {
        limit: limit ? Number(limit) : undefined,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        sortBy: sortBy as 'quantity' | 'revenue',
      });

      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async getRecentTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { limit } = req.query;

      const transactions = await dashboardService.getRecentTransactions(
        pharmacyId,
        limit ? Number(limit) : 10
      );

      res.json({ success: true, data: transactions });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();