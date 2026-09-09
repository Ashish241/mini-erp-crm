import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { customerSchema, updateCustomerSchema, followUpSchema } from '../validators/customer.validator';

const router = Router();

router.use(authenticate);

router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);

router.post(
  '/',
  authorize('ADMIN', 'SALES'),
  validate(customerSchema),
  CustomerController.create
);

router.put(
  '/:id',
  authorize('ADMIN', 'SALES'),
  validate(updateCustomerSchema),
  CustomerController.update
);

router.post(
  '/:id/follow-ups',
  authorize('ADMIN', 'SALES'),
  validate(followUpSchema),
  CustomerController.addFollowUp
);

export default router;
