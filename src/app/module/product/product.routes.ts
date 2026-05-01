import { multerUpload } from '../../config/multer.config';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { ProductController } from '../../module/product/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '../../module/product/product.validation';
import { Role } from '../../module/user/user.interface';
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

router.get('/features', ProductController.featuresProduct);

router.get('/bySlugs', ProductController.getProductByISlug);

export const ProductRoutes = router;
