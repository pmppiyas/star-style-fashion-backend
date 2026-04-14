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
  sku: string; // Stock Keeping Unit (Unique ID)
  status: TProductStatus;

  // ফ্যাশন স্পেসিফিক (Variants)
  images: string[]; // ছবির লিঙ্ক এর অ্যারে
  thumbnail: string; // মেইন থাম্বনেইল ছবি
  colors?: string[]; // যেমন: ['Navy Blue', 'Maroon']
  sizes?: string[]; // যেমন: ['S', 'M', 'L', 'XL', 'XXL']
  material?: string; // যেমন: 'Georgette', 'Cherry Fabric'

  // অতিরিক্ত তথ্য
  isFeatured: boolean; // হোমপেজে হাইলাইট করার জন্য
  isTodayDeal?: boolean; // বিশেষ অফারের জন্য
  ratings: {
    average: number;
    count: number;
  };

  // মেটা ডাটা (SEO এর জন্য)
  metaTitle?: string;
  metaDescription?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
