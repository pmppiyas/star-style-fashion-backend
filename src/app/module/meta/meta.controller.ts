import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MetaServices } from './meta.services';

const getAdminMeta = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await MetaServices.getAdminMeta();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Admin meta retrieved successfully!',
      data: data,
    });
  }
);

export const MetaController = {
  getAdminMeta,
};
