import { UserController } from '@app/module/user/user.controller';
import { Router } from 'express';

const router = Router();

router.post('/signup', UserController.signup);

export const UserRoutes = router;
