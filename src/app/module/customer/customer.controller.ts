import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CustomerServices } from './customer.services';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllCustomers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await CustomerServices.getAllCustomers();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All customers retrieved successfully',
      data: data,
    });
  }
);

export const CustomerController = {
  getAllCustomers,
};
