"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategoryWithSubSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createCategoryWithSubSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        error: 'Category name is required',
    })
        .trim()
        .min(1, 'Category name is too short'),
    children: zod_1.default
        .array(zod_1.default.object({
        name: zod_1.default
            .string({
            error: 'Category name is required',
        })
            .trim(),
    }))
        .optional(),
    parentId: zod_1.default.string().optional(),
});
exports.updateCategorySchema = zod_1.default
    .object({
    categoryId: zod_1.default.string({
        error: 'Category ID is required',
    }),
    MODE: zod_1.default.enum(['EDIT', 'MOVE']).refine((val) => !!val, {
        message: 'MODE must be either EDIT or MOVE',
    }),
    name: zod_1.default.string().trim().min(1, 'Category name is too short').optional(),
    parentId: zod_1.default.string().optional(),
})
    .refine((data) => {
    if (data.MODE === 'EDIT') {
        return !!data.name;
    }
    return true;
}, {
    message: 'Name is required when MODE is EDIT',
    path: ['name'],
})
    .refine((data) => {
    if (data.MODE === 'MOVE') {
        return !!data.parentId;
    }
    return true;
}, {
    message: 'Parent ID is required when MODE is MOVE',
    path: ['parentId'],
});
