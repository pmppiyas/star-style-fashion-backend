import { OrderService } from '@app/module/order/order.services';
import catchAsync from '@app/utils/catchAsync';
import sendResponse from '@app/utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.createOrder({ payload: req.body });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Order created successfully',
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
};
