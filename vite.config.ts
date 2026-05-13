/* eslint-disable prettier/prettier */
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Мок-API: `npm run dev:server` → server/index.mjs (:4000). Spring Boot: задайте VITE_API_PROXY_TARGET=http://127.0.0.1:8080
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.trim() || 'http://127.0.0.1:4000';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      host: '127.0.0.1',
      cors: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});