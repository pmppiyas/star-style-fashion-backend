import { z } from 'zod';

export const UserZodSchema = z.object({
  name: z.string().optional(),
  number: z
    .string()
    .refine((val) => /^(?:\+88|88)?(01[3-9]\d{8})$/.test(val), {
      message: 'Please provide a valid Bangladeshi phone number',
    })
    .optional(),
  location: z.array(z.string()).optional(),
  profileImage: z.string().optional(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
