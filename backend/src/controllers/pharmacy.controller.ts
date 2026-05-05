import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from '../services/pharmacy.service';

const pharmacyService = new PharmacyService();

export class PharmacyController {
  async getPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const pharmacy = await pharmacyService.getPharmacyById(pharmacyId);

      res.json({ success: true, data: pharmacy });
    } catch (error) {
      next(error);
    }
  }

  async updatePharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const pharmacy = await pharmacyService.updatePharmacy(pharmacyId, req.body);

      res.json({
        success: true,
        data: pharmacy,
        message: 'Pharmacy updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const result = await pharmacyService.uploadLogo(pharmacyId, req.file);

      res.json({
        success: true,
        data: result,
        message: 'Logo uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pharmacyController = new PharmacyController();