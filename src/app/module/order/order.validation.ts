import { z } from 'zod';

const orderItemSchema = z.object({
  slug: z.string().min(1, 'Product slug is required'),

  quantity: z
    .number({
      error: 'Quantity is required',
    })
    .int()
    .min(1, 'Quantity must be at least 1'),
  size: z.string().min(1, 'Size is required'),
});

const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),

  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Enter valid Bangladeshi phone number'),

  address: z.string().min(5, 'Address is required'),
});

export const createOrderZodSchema = z.object({
  body: z.object({
    customer: customerSchema,

    paymentMethod: z.enum(['cash_on_delivery']),

    items: z.array(orderItemSchema).min(1, 'At least one item is required'),

    subtotal: z.number().min(0),

    shippingFee: z.number().min(0),

    grandTotal: z.number().min(0),

    status: z
      .enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .optional(),
  }),
});
