import { OrderService } from '../../module/order/order.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
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

const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.getOrders({
      status: req.query?.status as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Orders retrieved successfully',
      data: result,
    });
  }
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.updateOrderStatus({
      orderId: req.params.id as string,
      status: req.body.status,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order status updated successfully',
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
