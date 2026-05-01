import env from '../config/env.config';
import { AppError } from '../error/appError';
import { User } from '../module/user/user.model';
import { IJwtPayload } from '../types/share';
import { verifyToken } from '../utils/jwt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken =
        req.cookies['access-token'] || req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, 'No Token Received');
      }

      const decoded = verifyToken(
        accessToken,
        env.JWT.ACCESS_SECRET
      ) as IJwtPayload;

      if (!roles.includes(decoded.role)) {
        throw new AppError(403, 'You are not permitted for this route');
      }

      const isUserExist = await User.findOne({
        $or: [{ email: decoded.identifier }, { number: decoded.identifier }],
      });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist');
      }

      if (isUserExist.status === 'SUSPEND') {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User is suspended');
      }

      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};
