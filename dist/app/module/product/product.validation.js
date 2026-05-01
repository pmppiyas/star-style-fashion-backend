"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string({ error: 'Name is required' }).min(3).trim(),
    description: zod_1.z.string({ error: 'Description is required' }).min(10),
    summary: zod_1.z.string().optional(),
    price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().positive()),
    discount: zod_1.z.preprocess((val) => (val ? Number(val) : 0), zod_1.z.number().optional()),
    costPrice: zod_1.z.preprocess((val) => (val ? Number(val) : undefined), zod_1.z.number().optional()),
    stock: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().nonnegative()),
    solded: zod_1.z.preprocess((val) => (val ? Number(val) : 0), zod_1.z.number().optional()),
    categoryId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
    subCategoryId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .nullable(),
    brand: zod_1.z.string().optional(),
    sku: zod_1.z.string({ error: 'SKU is required' }),
    status: zod_1.z
        .enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'])
        .default('IN_STOCK'),
    isFeatured: zod_1.z.preprocess((val) => val === 'true', zod_1.z.boolean().default(false)),
    isTodayDeal: zod_1.z.preprocess((val) => val === 'true', zod_1.z.boolean().optional()),
    colors: zod_1.z.string().optional(),
    sizes: zod_1.z.string().optional(),
    material: zod_1.z.string().optional(),
    ratings: zod_1.z
        .object({
        average: zod_1.z.number().min(0).max(5).default(0),
        count: zod_1.z.number().nonnegative().default(0),
    })
        .optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
