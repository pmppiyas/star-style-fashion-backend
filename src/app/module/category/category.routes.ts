import { checkAuth } from '@app/middleware/checkAuth';
import { validateRequest } from '@app/middleware/validateRequest';
import { CategoryController } from '@app/module/category/category.controller';
import {
  createCategoryWithSubSchema,
  updateCategorySchema,
} from '@app/module/category/category.validation';
import { Role } from '@app/module/user/user.interface';
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
