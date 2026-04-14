import { ProductService } from '@app/module/product/product.service';
import catchAsync from '@app/utils/catchAsync';
import sendResponse from '@app/utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const addProduct = catchAsync(
  async (req: Request, res: Response, nest: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    const imageUrls = files.map((file) => file.path);

    const payload = {
      ...req.body,
      images: imageUrls,
      thumbnail: imageUrls[0],
    };

    const result = await ProductService.addProduct(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product added successfully!',
      data: result,
    });
  }
);

export const ProductController = {
  addProduct,
};
