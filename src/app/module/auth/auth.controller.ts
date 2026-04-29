import { AppError } from '@app/error/appError';
import { AuthServices } from '@app/module/auth/auth.services';
import { IJwtPayload } from '@app/types/share';
import catchAsync from '@app/utils/catchAsync';
import { clearAuthCookies } from '@app/utils/clearCookie';
import sendResponse from '@app/utils/sendResponse';
import { setAuthCookie } from '@app/utils/setCookie';
import { createUserToken } from '@app/utils/userTokem';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(StatusCodes.METHOD_NOT_ALLOWED, info.message));
      }

      if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, info.message));
      }

      const token = createUserToken(user);

      setAuthCookie(res, token);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User login successfully',
        data: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      });
    })(req, res, next);
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Logout successfully',
      data: null,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const me = await AuthServices.getMe(req.user as IJwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'My data retreived successfully',
      data: me,
    });
  }
);

export const AuthController = {
  credentialLogin,
  logout,
  getMe,
};
