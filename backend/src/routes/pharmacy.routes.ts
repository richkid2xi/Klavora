import { Router } from 'express';
import { pharmacyController } from '../controllers/pharmacy.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);

router.get('/', pharmacyController.getPharmacy.bind(pharmacyController));
router.put('/', authorize('ADMIN'), pharmacyController.updatePharmacy.bind(pharmacyController));
router.post('/logo', authorize('ADMIN'), upload.single('logo'), pharmacyController.uploadLogo.bind(pharmacyController));

export default router;