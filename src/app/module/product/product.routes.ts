import { multerUpload } from '@app/config/multer.config';
import { checkAuth } from '@app/middleware/checkAuth';
import { validateRequest } from '@app/middleware/validateRequest';
import { ProductController } from '@app/module/product/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '@app/module/product/product.validation';
import { Role } from '@app/module/user/user.interface';
import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN),
  multerUpload.array('images'),
  validateRequest(createProductSchema),
  ProductController.addProduct
);

router.get('', ProductController.getAllProducts);

router.put(
  '/update/:id',
  checkAuth(Role.ADMIN),
  multerUpload.array('images'),
  validateRequest(updateProductSchema),
  ProductController.updateProduct
);

router.delete(
  '/delete/:id',
  checkAuth(Role.ADMIN),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
