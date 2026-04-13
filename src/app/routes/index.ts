import { AuthRoutes } from '@app/module/auth/auth.router';
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
