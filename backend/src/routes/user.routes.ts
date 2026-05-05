import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), userController.getUsers.bind(userController));
router.post('/', authorize('ADMIN'), userController.createUser.bind(userController));
router.get('/:id', authorize('ADMIN'), userController.getUserById.bind(userController));
router.put('/:id', authorize('ADMIN'), userController.updateUser.bind(userController));
router.patch('/:id/deactivate', authorize('ADMIN'), userController.deactivateUser.bind(userController));
router.patch('/:id/activate', authorize('ADMIN'), userController.activateUser.bind(userController));
router.put('/me/password', userController.changePassword.bind(userController));

export default router;