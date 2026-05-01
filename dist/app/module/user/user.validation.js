"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
const zod_1 = require("zod");
exports.UserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    number: zod_1.z.string().refine((val) => /^(?:\+88|88)?(01[3-9]\d{8})$/.test(val), {
        message: 'Please provide a valid Bangladeshi phone number',
    }),
    location: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    password: zod_1.z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});
