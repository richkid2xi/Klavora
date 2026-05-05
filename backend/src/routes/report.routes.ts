import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/sales', authorize('ADMIN', 'PHARMACIST'), reportController.getSalesReport.bind(reportController));
router.get('/inventory', authorize('ADMIN', 'PHARMACIST'), reportController.getInventoryReport.bind(reportController));
router.get('/expiry', authorize('ADMIN', 'PHARMACIST'), reportController.getExpiryReport.bind(reportController));
router.get('/profit-loss', authorize('ADMIN'), reportController.getProfitLossReport.bind(reportController));

export default router;