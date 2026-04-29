import { AuthRoutes } from '@app/module/auth/auth.router';
import { CategoryRoutes } from '@app/module/category/category.routes';
import { OrderRoutes } from '@app/module/order/order.routes';
import { ProductRoutes } from '@app/module/product/product.routes';
import { UserRoutes } from '@app/module/user/user.routes';
import { ImoduleRoutes } from '@app/types/share';
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
