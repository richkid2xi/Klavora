import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', inventoryController.getItems.bind(inventoryController));
router.post('/', authorize('PHARMACIST', 'ADMIN'), inventoryController.createItem.bind(inventoryController));
router.get('/low-stock', inventoryController.getLowStock.bind(inventoryController));
router.get('/expiring-soon', inventoryController.getExpiringSoon.bind(inventoryController));
router.get('/search', inventoryController.searchItems.bind(inventoryController));
router.get('/:id', inventoryController.getItemById.bind(inventoryController));
router.put('/:id', authorize('PHARMACIST', 'ADMIN'), inventoryController.updateItem.bind(inventoryController));
router.patch('/:id/deactivate', authorize('ADMIN'), inventoryController.deactivateItem.bind(inventoryController));
router.get('/:id/batches', inventoryController.getBatches.bind(inventoryController));
router.post('/:id/batches', authorize('PHARMACIST', 'ADMIN'), inventoryController.createBatch.bind(inventoryController));
router.post('/:id/adjust', authorize('PHARMACIST', 'ADMIN'), inventoryController.adjustStock.bind(inventoryController));

export default router;