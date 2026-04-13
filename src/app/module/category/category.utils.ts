import { Types } from 'mongoose';
import { z } from 'zod';

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  parentId?: Types.ObjectId;
}

export const createCategoryWithSubSchema = z.object({
  name: z
    .string({
      error: 'Category name is required',
    })
    .trim()
    .min(1, 'Category name is too short'),

  children: z
    .array(
      z.object({
        name: z
          .string({
            error: 'Category name is required',
          })
          .trim(),
      })
    )
    .optional(),
});
