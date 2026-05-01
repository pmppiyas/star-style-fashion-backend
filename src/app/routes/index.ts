import { AuthRoutes } from '../module/auth/auth.router';
import { CategoryRoutes } from '../module/category/category.routes';
import { OrderRoutes } from '../module/order/order.routes';
import { ProductRoutes } from '../module/product/product.routes';
import { UserRoutes } from '../module/user/user.routes';
import { ImoduleRoutes } from '../types/share';
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
  {
    path: '/order',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
