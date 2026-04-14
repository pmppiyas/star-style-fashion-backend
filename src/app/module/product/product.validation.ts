import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(10),
  price: z.number().positive(),
  discountPrice: z.number().optional(),
  costPrice: z.number().optional(),
  stock: z.number().nonnegative(),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  subCategoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  status: z
    .enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'])
    .default('IN_STOCK'),
  isFeatured: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
