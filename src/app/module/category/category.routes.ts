import { validateRequest } from '@app/middleware/validateRequest';
import { CategoryController } from '@app/module/category/category.controller';
import { createCategoryWithSubSchema } from '@app/module/category/category.utils';
import { Router } from 'express';

const router = Router();

router.post(
  '/create',
  validateRequest(createCategoryWithSubSchema),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
