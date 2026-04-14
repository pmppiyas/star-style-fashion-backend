import { AppError } from '@app/error/appError';
import { IOptions, IProduct } from '@app/module/product/product.interface';
import { Product } from '@app/module/product/product.model';
import { calculatePagination } from '@app/utils/calculatePagination';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import slugify from 'slugify';

const addProduct = async (payload: IProduct) => {
  const baseSlug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const existingProducts = await Product.find({
    slug: { $regex: `^${baseSlug}` },
  }).select('slug');

  const serial = String(existingProducts.length + 1).padStart(3, '0');

  const slug = `${baseSlug}-${serial}`;

  if (payload.discountPrice && payload.discountPrice >= payload.price) {
    throw new Error('Discount price must be less than price');
  }

  const productData = {
    ...payload,
    slug,
    isFeatured: payload.isFeatured ?? false,
    status: payload.status ?? 'IN_STOCK',
  };

  const result = await Product.create(productData);
  return result;
};

const getAllProducts = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options);

  const { searchTerm, minPrice, maxPrice, categoryId, subCategoryId, ...rest } =
    filters;

  const andConditions: any[] = [];

  if (categoryId) {
    andConditions.push({
      categoryId: new Types.ObjectId(categoryId),
    });
  }

  if (subCategoryId) {
    andConditions.push({
      subCategoryId: new Types.ObjectId(subCategoryId),
    });
  }

  if (searchTerm) {
    const cleanSearch = searchTerm.trim();

    andConditions.push({
      $or: [
        { name: { $regex: new RegExp(cleanSearch, 'i') } },
        { brand: { $regex: new RegExp(cleanSearch, 'i') } },
        { description: { $regex: new RegExp(cleanSearch, 'i') } },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      },
    });
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {};

  const sortCondition: any = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  const result = await Product.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereCondition);

  return {
    meta: { page, limit, total },
    products: result,
  };
};

const updateProduct = async (productId: string, payload: Partial<IProduct>) => {
  const isExistProduct = await Product.findById(productId);

  if (!isExistProduct) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Targeted product not found');
  }

  const existingImages = isExistProduct.images || [];

  if (payload.images && payload.images.length > 0) {
    payload.images = [...existingImages, ...payload.images];
  }

  if (!isExistProduct.thumbnail) {
    payload.thumbnail = payload?.images?.[0];
  }

  if (payload.categoryId) {
    payload.categoryId = new Types.ObjectId(payload.categoryId) as any;
  }

  if (payload.subCategoryId) {
    payload.subCategoryId = new Types.ObjectId(payload.subCategoryId) as any;
  }

  if (
    payload.price &&
    payload.discountPrice &&
    payload.discountPrice >= payload.price
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Discount price must be less than regular price'
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

export const ProductService = {
  addProduct,
  getAllProducts,
  updateProduct,
};
