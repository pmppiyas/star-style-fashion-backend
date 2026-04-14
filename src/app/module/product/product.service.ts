import { IProduct } from '@app/module/product/product.interface';
import { Product } from '@app/module/product/product.model';
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

export const ProductService = {
  addProduct,
};
