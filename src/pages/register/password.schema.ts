import { z } from 'zod';

/** Минимум 8 символов, строчная и заглавная буква, хотя бы одна цифра (латиница или кириллица). */
export const registerPasswordField = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({
      code: 'custom',
      message: 'Минимум 8 символов',
    });
    return;
  }

  const parts: string[] = [];
  if (!/[a-zа-яё]/.test(val)) {
    parts.push('нужна хотя бы одна строчная буква');
  }
  if (!/[A-ZА-ЯЁ]/.test(val)) {
    parts.push('нужна хотя бы одна заглавная буква');
  }
  if (!/\d/.test(val)) {
    parts.push('нужна хотя бы одна цифра');
  }

  if (parts.length > 0) {
    ctx.addIssue({
      code: 'custom',
      message: parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('. ') + '.',
    });
  }
});
