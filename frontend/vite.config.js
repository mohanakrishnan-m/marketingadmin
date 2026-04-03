import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'dev'
    ? {
        proxy: {
          '/api': {
            target: process.env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:8000',
            changeOrigin: true,
          },
        },
      }
    : undefined,
}));
