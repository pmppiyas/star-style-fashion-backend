import { IProduct } from '@app/module/product/product.interface';
import { Schema, model } from 'mongoose';

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      index: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    summary: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (this: IProduct, value: number) {
          if (!value) return true;
          return value < this.price;
        },
        message: 'Discount price should be lower than regular price',
      },
    },
    costPrice: {
      type: Number,
    },
    solded: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: String,
      default: 'Star Style',
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'UPCOMING'],
      default: 'IN_STOCK',
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
    colors: [String],
    sizes: [String],
    material: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTodayDeal: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.index({ name: 'text', description: 'text' });

export const Product = model<IProduct>('Product', ProductSchema);
