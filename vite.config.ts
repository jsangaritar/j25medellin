import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { apiDevPlugin } from './src/vite-api-plugin';

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
          ],
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
          ],
        },
      },
    },
  },
});
