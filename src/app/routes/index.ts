import { AuthRoutes } from '@app/module/auth/auth.router';
import { CategoryRoutes } from '@app/module/category/category.routes';
import { ProductRoutes } from '@app/module/product/product.routes';
import { UserRoutes } from '@app/module/user/user.routes';
import { ImoduleRoutes } from '@app/types/types';
import { Router } from 'express';

const router = Router();

const moduleRoutes: ImoduleRoutes[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
