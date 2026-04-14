import { IOptions, IProduct } from '@app/module/product/product.interface';
import { Product } from '@app/module/product/product.model';
import { calculatePagination } from '@app/utils/calculatePagination';
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

export const ProductService = {
  addProduct,
  getAllProducts,
};
