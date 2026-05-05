import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export class ReportController {
  async getSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { dateFrom, dateTo, groupBy } = req.query;

      if (!dateFrom || !dateTo) {
        throw new Error('dateFrom and dateTo are required');
      }

      const report = await reportService.getSalesReport(pharmacyId, {
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        groupBy: groupBy as 'day' | 'week' | 'month',
      });

      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getInventoryReport(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const report = await reportService.getInventoryReport(pharmacyId);

      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getExpiryReport(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { days } = req.query;

      const report = await reportService.getExpiryReport(pharmacyId, {
        days: days ? Number(days) : undefined,
      });

      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getProfitLossReport(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { dateFrom, dateTo } = req.query;

      if (!dateFrom || !dateTo) {
        throw new Error('dateFrom and dateTo are required');
      }

      const report = await reportService.getProfitLossReport(pharmacyId, {
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
      });

      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();