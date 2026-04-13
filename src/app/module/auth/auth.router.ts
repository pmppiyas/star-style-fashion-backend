import { AuthController } from '@app/module/auth/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/login', AuthController.credentialLogin);

export const AuthRoutes = router;
