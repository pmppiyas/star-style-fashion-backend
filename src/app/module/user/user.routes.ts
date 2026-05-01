import { validateRequest } from '../../middleware/validateRequest';
import { UserController } from '../../module/user/user.controller';
import { UserZodSchema } from '../../module/user/user.validation';

import { Router } from 'express';

const router = Router();

router.post('/signup', validateRequest(UserZodSchema), UserController.signup);

export const UserRoutes = router;
