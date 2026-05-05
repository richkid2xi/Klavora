import { Router } from 'express';
import { alertController } from '../controllers/alert.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', alertController.getAlerts.bind(alertController));
router.get('/unread-count', alertController.getUnreadCount.bind(alertController));
router.patch('/:id/read', alertController.markAsRead.bind(alertController));
router.post('/read-all', alertController.markAllAsRead.bind(alertController));
router.patch('/:id/resolve', authorize('PHARMACIST', 'ADMIN'), alertController.resolveAlert.bind(alertController));

export default router;