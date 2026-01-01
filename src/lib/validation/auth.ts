import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
