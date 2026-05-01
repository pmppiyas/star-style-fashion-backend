import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { CategoryController } from '../../module/category/category.controller';
import {
  createCategoryWithSubSchema,
  updateCategorySchema,
} from '../../module/category/category.validation';
import { Role } from '../../module/user/user.interface';

import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN),
  validateRequest(createCategoryWithSubSchema),
  CategoryController.createCategory
);

router.get('/all', CategoryController.getAllCategories);

router.put(
  '/update',
  checkAuth(Role.ADMIN),
  validateRequest(updateCategorySchema),
  CategoryController.updateCategory
);

router.delete('/:id', checkAuth(Role.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
