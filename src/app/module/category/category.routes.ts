import { validateRequest } from '@app/middleware/validateRequest';
import { CategoryController } from '@app/module/category/category.controller';
import {
  createCategoryWithSubSchema,
  updateCategorySchema,
} from '@app/module/category/category.validation';
import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  validateRequest(createCategoryWithSubSchema),
  CategoryController.createCategory
);

router.get('/all', CategoryController.getAllCategories);

router.put(
  '/update',
  validateRequest(updateCategorySchema),
  CategoryController.updateCategory
);

router.delete('/:id', CategoryController.deleteCategory);

export const CategoryRoutes = router;
