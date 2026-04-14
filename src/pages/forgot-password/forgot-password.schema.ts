import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Введите корректный email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
