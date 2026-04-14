import { multerUpload } from '@app/config/multer.config';
import { validateRequest } from '@app/middleware/validateRequest';
import { ProductController } from '@app/module/product/product.controller';
import { createProductSchema } from '@app/module/product/product.validation';
import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  multerUpload.array('images'),
  validateRequest(createProductSchema),
  ProductController.addProduct
);

router.get('', ProductController.getAllProducts);

export const ProductRoutes = router;
