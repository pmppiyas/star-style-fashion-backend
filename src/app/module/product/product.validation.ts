import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(3).trim(),
  description: z.string({ error: 'Description is required' }).min(10),
  summary: z.string().optional(),

  price: z.preprocess((val) => Number(val), z.number().positive()),
  discount: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().optional()
  ),
  costPrice: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional()
  ),
  stock: z.preprocess((val) => Number(val), z.number().nonnegative()),
  solded: z.preprocess((val) => (val ? Number(val) : 0), z.number().optional()),

  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
  subCategoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .nullable(),
  brand: z.string().optional(),
  sku: z.string({ error: 'SKU is required' }),

  status: z
    .enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'])
    .default('IN_STOCK'),

  isFeatured: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  isTodayDeal: z.preprocess((val) => val === 'true', z.boolean().optional()),

  colors: z.string().optional(),
  sizes: z.string().optional(),
  material: z.string().optional(),

  ratings: z
    .object({
      average: z.number().min(0).max(5).default(0),
      count: z.number().nonnegative().default(0),
    })
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
