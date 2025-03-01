import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Можна замінити на '0.0.0.0', якщо хочеш доступ із зовнішніх пристроїв
    port: 5173, // Стандартний порт Vite
    strictPort: true, // Якщо порт зайнятий, Vite не змінюватиме його
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Зручний alias для імпорту файлів із `/src`
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Включає сорс-мапи для відладки
  },
});
