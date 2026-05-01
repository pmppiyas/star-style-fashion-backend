"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderZodSchema = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, 'Product slug is required'),
    quantity: zod_1.z
        .number({
        error: 'Quantity is required',
    })
        .int()
        .min(1, 'Quantity must be at least 1'),
    size: zod_1.z.string().min(1, 'Size is required'),
});
const customerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name is required'),
    phone: zod_1.z
        .string()
        .regex(/^01[3-9]\d{8}$/, 'Enter valid Bangladeshi phone number'),
    address: zod_1.z.string().min(5, 'Address is required'),
});
exports.createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer: customerSchema,
        paymentMethod: zod_1.z.enum(['cash_on_delivery']),
        items: zod_1.z.array(orderItemSchema).min(1, 'At least one item is required'),
        subtotal: zod_1.z.number().min(0),
        shippingFee: zod_1.z.number().min(0),
        grandTotal: zod_1.z.number().min(0),
        status: zod_1.z
            .enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
            .optional(),
    }),
});
