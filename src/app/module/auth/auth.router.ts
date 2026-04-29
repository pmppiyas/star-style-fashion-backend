import { checkAuth } from '@app/middleware/checkAuth';
import { AuthController } from '@app/module/auth/auth.controller';
import { Role } from '@app/module/user/user.interface';
import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/signin', AuthController.credentialLogin);

router.post('/logout', AuthController.logout);

router.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/';

    passport.authenticate('google', {
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
      ],
      prompt: 'consent',

      state: redirect as string,
    })(req, res, next);
  }
);

router.get('/me', checkAuth(...Object.keys(Role)), AuthController.getMe);
export const AuthRoutes = router;
