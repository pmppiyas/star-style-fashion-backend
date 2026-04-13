import { AuthRoutes } from '@app/module/auth/auth.router';
import { CategoryRoutes } from '@app/module/category/category.routes';
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
