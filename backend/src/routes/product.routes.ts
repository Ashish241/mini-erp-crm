import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { productSchema, updateProductSchema, stockMovementSchema } from '../validators/product.validator';

const router = Router();

router.use(authenticate);

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.get('/:id/movements', ProductController.getMovements);

router.post(
  '/',
  authorize('ADMIN', 'WAREHOUSE'),
  validate(productSchema),
  ProductController.create
);

router.put(
  '/:id',
  authorize('ADMIN', 'WAREHOUSE'),
  validate(updateProductSchema),
  ProductController.update
);

router.post(
  '/:id/stock',
  authorize('ADMIN', 'WAREHOUSE'),
  validate(stockMovementSchema),
  ProductController.addStockMovement
);

export default router;
