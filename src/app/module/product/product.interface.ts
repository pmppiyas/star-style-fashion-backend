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
  solded: number;
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

export type IProductType =
  | 'banner'
  | 'new_arraival'
  | 'best_seller'
  | 'deal_of_the_day'
  | 'just_for_you';
