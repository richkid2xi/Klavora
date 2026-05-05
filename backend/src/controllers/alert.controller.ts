import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';

const alertService = new AlertService();

export class AlertController {
  async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { page, limit, type, severity, status } = req.query;

      const result = await alertService.getAlerts(pharmacyId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        type: type as string,
        severity: severity as string,
        status: status as string,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const result = await alertService.getUnreadCount(pharmacyId);

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const result = await alertService.markAsRead(id, pharmacyId);

      res.json({
        success: true,
        data: result,
        message: 'Alert marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const result = await alertService.markAllAsRead(pharmacyId);

      res.json({
        success: true,
        data: result,
        message: 'All alerts marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  async resolveAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const result = await alertService.resolveAlert(id, pharmacyId);

      res.json({
        success: true,
        data: result,
        message: 'Alert resolved',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();