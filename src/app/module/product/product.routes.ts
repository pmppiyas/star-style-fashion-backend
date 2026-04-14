import { multerUpload } from '@app/config/multer.config';
import { validateRequest } from '@app/middleware/validateRequest';
import { ProductController } from '@app/module/product/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '@app/module/product/product.validation';
import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  multerUpload.array('images'),
  validateRequest(createProductSchema),
  ProductController.addProduct
);

router.get('', ProductController.getAllProducts);

router.put(
  '/update/:id',
  multerUpload.array('images'),
  validateRequest(updateProductSchema),
  ProductController.updateProduct
);

router.delete('/delete/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
