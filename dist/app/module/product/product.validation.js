"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).trim(),
    description: zod_1.z.string().min(10),
    price: zod_1.z.number().positive(),
    discountPrice: zod_1.z.number().optional(),
    costPrice: zod_1.z.number().optional(),
    stock: zod_1.z.number().nonnegative(),
    categoryId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/),
    subCategoryId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),
    colors: zod_1.z.array(zod_1.z.string()).optional(),
    sizes: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z
        .enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'])
        .default('IN_STOCK'),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
