import { UserServices } from '../../module/user/user.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.signup(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Signup successfull!',
      data: user,
    });
  }
);

export const UserController = {
  signup,
};
