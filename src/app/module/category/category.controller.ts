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

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Categories retrieved successfully!',
      data: categories,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryService.updateCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully!',
      data: result,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;

    const result = await CategoryService.deleteCategory(categoryId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category deleted successfully!',
      data: result,
    });
  }
);

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
