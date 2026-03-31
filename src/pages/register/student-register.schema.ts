import { z } from 'zod';

import { registerPasswordField } from './password.schema';

export const studentRegisterSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Введите имя'),
    email: z.email({ error: 'Укажите корректный email' }),
    username: z.string().trim().min(1, 'Введите логин'),
    password: registerPasswordField,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    groupCode: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type StudentRegisterFormValues = z.infer<typeof studentRegisterSchema>;
