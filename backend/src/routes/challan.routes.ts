import { Router } from 'express';
import { ChallanController } from '../controllers/challan.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createChallanSchema } from '../validators/challan.validator';

const router = Router();

router.use(authenticate);

router.get('/', ChallanController.getAll);
router.get('/:id', ChallanController.getById);

router.post(
  '/',
  authorize('ADMIN', 'SALES'),
  validate(createChallanSchema),
  ChallanController.createDraft
);

router.post(
  '/:id/confirm',
  authorize('ADMIN', 'SALES'),
  ChallanController.confirm
);

router.post(
  '/:id/cancel',
  authorize('ADMIN', 'SALES'),
  ChallanController.cancel
);

export default router;
