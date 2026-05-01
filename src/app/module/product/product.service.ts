import { AppError } from '../../error/appError';
import { Category } from '../../module/category/category.model';
import {
  IOptions,
  IProduct,
  IProductPayload,
  IProductType,
} from '../../module/product/product.interface';
import { Product } from '../../module/product/product.model';
import { calculatePagination } from '../../utils/calculatePagination';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import slugify from 'slugify';

const addProduct = async (payload: IProductPayload) => {
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
  const parsedColors =
    typeof payload.colors === 'string'
      ? payload.colors
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(payload.colors)
        ? payload.colors
        : [];

  const parsedSizes =
    typeof payload.sizes === 'string'
      ? payload.sizes
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(payload.sizes)
        ? payload.sizes
        : [];

  const productData = {
    ...payload,
    slug,
    colors: parsedColors,
    sizes: parsedSizes,
    isFeatured: payload.isFeatured ?? false,
    status: payload.status ?? 'IN_STOCK',
  };

  const result = await Product.create(productData);
  return result;
};

const getAllProducts = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options);

  const {
    searchTerm,
    minPrice,
    maxPrice,
    categoryId,
    subCategoryId,
    category,
    subcategory,
  } = filters;

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

  if (category) {
    const foundCategory = await Category.findOne({
      slug: category,
    });

    if (foundCategory) {
      andConditions.push({
        categoryId: foundCategory._id,
      });

      if (subcategory) {
        const foundSubCategory = await Category.findOne({
          slug: subcategory,
          parentId: foundCategory._id,
        });

        if (foundSubCategory) {
          andConditions.push({
            subCategoryId: foundSubCategory._id,
          });
        }
      }
    }
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
    .limit(limit)
    .select('brand name slug price discountPrice ratings thumbnail');

  const total = await Product.countDocuments(whereCondition);

  return {
    meta: { page, limit, total },
    products: result,
  };
};

const updateProduct = async (slug: string, payload: Partial<IProduct>) => {
  const isExistProduct = await Product.findById(slug);

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

  const updatedProduct = await Product.findByIdAndUpdate(slug, payload, {
    returnDocument: 'after',
    runValidators: true,
  });

  return updatedProduct;
};

const deleteProduct = async (slug: string) => {
  const isExistProduct = await Product.findById(slug);

  if (!isExistProduct) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Targeted product not found');
  }

  await Product.findByIdAndUpdate(slug);
  return null;
};

const featuresProducts = async (type: IProductType, options: IOptions) => {
  const { limit, skip, sortOrder, sortBy } = calculatePagination(options);

  let results = [];

  const sortCondition: any = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  switch (type) {
    case 'banner':
      results = await Product.find({ isFeatured: true })
        .sort(
          Object.keys(sortCondition).length ? sortCondition : { createdAt: -1 }
        )
        .limit(limit || 5)
        .select('brand name slug price discountPrice ratings thumbnail');
      break;

    case 'new_arraival':
      results = await Product.find()
        .sort(
          Object.keys(sortCondition).length ? sortCondition : { createdAt: -1 }
        )
        .skip(skip)
        .limit(limit)
        .select('brand name slug price discountPrice ratings thumbnail');
      break;

    case 'best_seller':
      results = await Product.find()
        .sort(
          Object.keys(sortCondition).length
            ? sortCondition
            : { 'ratings.average': -1 }
        )
        .skip(skip)
        .limit(limit)
        .select('brand name slug price discountPrice ratings thumbnail');
      break;

    case 'deal_of_the_day':
      results = await Product.find({ isTodayDeal: true })
        .sort(
          Object.keys(sortCondition).length ? sortCondition : { updatedAt: -1 }
        )
        .skip(skip)
        .limit(limit)
        .select('brand name slug price discountPrice ratings thumbnail');
      break;

    case 'just_for_you':
      results = await Product.aggregate([
        { $sample: { size: 50 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            brand: 1,
            name: 1,
            slug: 1,
            price: 1,
            discountPrice: 1,
            ratings: 1,
            thumbnail: 1,
          },
        },
      ]);
      break;

    default:
      results = [];
  }

  return results;
};

const getProductByISlug = async (slugs: string[]) => {
  const products = await Product.find({
    slug: { $in: slugs },
  }).populate('categoryId subCategoryId');

  if (!products.length) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No products found');
  }

  return products;
};

export const ProductService = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  featuresProducts,
  getProductByISlug,
};
