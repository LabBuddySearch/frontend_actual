import { z } from 'zod';

const emailField = z.email({ error: 'Укажите корректный email' });

export const studentProfileEditSchema = z.object({
  fullName: z.string().trim().min(1, 'Введите имя'),
  email: emailField,
  username: z.string().trim().min(3, 'Логин — минимум 3 символа'),
  groupCode: z.string().trim(),
  studentHobbies: z.string().trim(),
});

export type StudentProfileEditValues = z.infer<typeof studentProfileEditSchema>;

export const teacherProfileEditSchema = z.object({
  fullName: z.string().trim().min(1, 'Введите ФИО'),
  email: emailField,
  username: z.string().trim().min(3, 'Логин — минимум 3 символа'),
});

export type TeacherProfileEditValues = z.infer<typeof teacherProfileEditSchema>;

export const adminProfileEditSchema = z.object({
  fullName: z.string().trim().min(1, 'Введите имя'),
  email: emailField,
  username: z.string().trim().min(3, 'Логин — минимум 3 символа'),
  adminNote: z.string().trim(),
});

export type AdminProfileEditValues = z.infer<typeof adminProfileEditSchema>;
