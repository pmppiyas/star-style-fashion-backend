import { AppError } from '../../error/appError';
import { AuthServices } from '../../module/auth/auth.services';
import { IJwtPayload } from '../../types/share';
import catchAsync from '../../utils/catchAsync';
import { clearAuthCookies } from '../../utils/clearCookie';
import sendResponse from '../../utils/sendResponse';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserToken } from '../../utils/userTokem';
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
