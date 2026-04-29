import {
  productFilterableFields,
  productOptionFields,
} from '@app/constant/product.constant';
import { IProductType } from '@app/module/product/product.interface';
import { ProductService } from '@app/module/product/product.service';
import catchAsync from '@app/utils/catchAsync';
import queryPick from '@app/utils/queryPick';
import sendResponse from '@app/utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const addProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = queryPick(req.query, productFilterableFields);
    const options = queryPick(req.query, productOptionFields);

    const result = await ProductService.getAllProducts(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'All products retrieved successfully!',
      data: result,
    });
  }
);

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    const imageUrls = files.map((file) => file.path);

    const payload = {
      ...req.body,
      images: imageUrls,
    };

    const result = await ProductService.updateProduct(
      req.params.id as string,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product updated successfully!',
      data: result,
    });
  }
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ProductService.deleteProduct(
      req?.params?.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product deleted successfully!',
      data: result,
    });
  }
);

const featuresProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = queryPick(req.query, productOptionFields);
    const result = await ProductService.featuresProducts(
      req?.query?.type as IProductType,
      options
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Featured products retrieved successfully!',
      data: result,
    });
  }
);

const getProductByISlug = catchAsync(async (req: Request, res: Response) => {
  const slugs = req.query.slugs as string;

  const slugArray = slugs.split(',');

  const result = await ProductService.getProductByISlug(slugArray);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products retrieved successfully!',
    data: result,
  });
});

export const ProductController = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  featuresProduct,
  getProductByISlug,
};
