import { validateRequest } from '@app/middleware/validateRequest';
import { UserController } from '@app/module/user/user.controller';
import { UserZodSchema } from '@app/module/user/user.validation';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateRequest(UserZodSchema), UserController.signup);

export const UserRoutes = router;
