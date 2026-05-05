import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', dashboardController.getStats.bind(dashboardController));
router.get('/sales-chart', dashboardController.getSalesChart.bind(dashboardController));
router.get('/top-products', dashboardController.getTopProducts.bind(dashboardController));
router.get('/recent-transactions', dashboardController.getRecentTransactions.bind(dashboardController));

export default router;