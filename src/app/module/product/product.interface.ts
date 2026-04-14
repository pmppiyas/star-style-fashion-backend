import { Types } from 'mongoose';

export type TProductStatus =
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'DISCONTINUED'
  | 'UPCOMING';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  summary?: string;

  price: number;
  discountPrice?: number;
  costPrice?: number;
  categoryId: Types.ObjectId;
  subCategoryId?: Types.ObjectId;
  brand?: string;

  stock: number;
  sku: string;
  status: TProductStatus;

  images: string[];
  thumbnail: string;
  colors?: string[];
  sizes?: string[];
  material?: string;

  isFeatured: boolean;
  isTodayDeal?: boolean;
  ratings: {
    average: number;
    count: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export type IOptions = {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
};

export type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
