import { z } from 'zod';

import { registerPasswordField } from './password.schema';

export const teacherRegisterSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Введите ФИО'),
    email: z.email({ error: 'Укажите корректный email' }),
    username: z.string().trim().min(1, 'Введите логин'),
    password: registerPasswordField,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type TeacherRegisterFormValues = z.infer<typeof teacherRegisterSchema>;
