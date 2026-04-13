import { CategoryService } from '@app/module/category/category.services';
import catchAsync from '@app/utils/catchAsync';
import sendResponse from '@app/utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await CategoryService.addCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Category created successfully!',
      data: category,
    });
  }
);

export const CategoryController = {
  createCategory,
};
