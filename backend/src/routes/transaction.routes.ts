import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', transactionController.getTransactions.bind(transactionController));
router.post('/', authorize('CASHIER', 'PHARMACIST', 'ADMIN'), transactionController.createTransaction.bind(transactionController));
router.get('/recent', transactionController.getRecentTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));
router.patch('/:id/payment', authorize('CASHIER', 'PHARMACIST', 'ADMIN'), transactionController.updatePaymentStatus.bind(transactionController));
router.post('/:id/void', authorize('ADMIN'), transactionController.voidTransaction.bind(transactionController));

export default router;