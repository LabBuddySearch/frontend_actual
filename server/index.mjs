import 'dotenv/config';

import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4000);
const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:3000';

/** @type {Map<string, { email: string; role: string }>} */
const pendingTokens = new Map();

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

async function sendVerificationEmail({ to, token, roleLabel }) {
  const link = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = 'Подтвердите email';
  const html = `
    <p>Здравствуйте!</p>
    <p>Вы регистрируетесь на платформе как <strong>${roleLabel}</strong>.</p>
    <p>Подтвердите адрес электронной почты, перейдя по ссылке:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Если вы не создавали аккаунт, проигнорируйте это письмо.</p>
  `.trim();

  const transport = createTransport();
  const from = process.env.SMTP_FROM ?? 'noreply@localhost';

  if (!transport) {
    console.log('\n[API] SMTP не настроен (SMTP_HOST). Письмо не отправлено.');
    console.log('[API] Ссылка подтверждения для', to, ':\n', link, '\n');
    return { dev: true, link };
  }

  await transport.sendMail({ from, to, subject, html });
  return { dev: false };
}

function handleRegister(role, roleLabel) {
  return async (req, res) => {
    try {
      const body = req.body ?? {};
      const { fullName, username, email, password, groupCode } = body;

      if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'Заполните обязательные поля' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      pendingTokens.set(token, { email: String(email), role });

      await sendVerificationEmail({
        to: String(email),
        token,
        roleLabel,
      });

      // В продакшене: сохранить пользователя (с хешем пароля) и отправить письмо.
      void groupCode;
      void password;

      res.json({
        ok: true,
        message: 'Проверьте почту для подтверждения email.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось отправить письмо' });
    }
  };
}

app.post('/api/auth/register/student', handleRegister('student', 'студент'));
app.post('/api/auth/register/teacher', handleRegister('teacher', 'преподаватель'));

app.get('/api/auth/verify-email', (req, res) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  if (!token) {
    return res.status(400).json({ error: 'Отсутствует токен' });
  }
  const row = pendingTokens.get(token);
  if (!row) {
    return res.status(400).json({ error: 'Ссылка недействительна или устарела' });
  }
  pendingTokens.delete(token);
  console.log('[API] Email подтверждён:', row.email, row.role);
  res.json({ ok: true });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Register API: http://127.0.0.1:${PORT}`);
});
