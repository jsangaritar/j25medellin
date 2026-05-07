import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { apiDevPlugin } from './src/vite-api-plugin';

export default defineConfig({
  server: {
    port: 3005,
  },
  plugins: [
    react(),
    tailwindcss(),
    apiDevPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['j25-logo.svg', 'icons/*.png'],
      manifest: {
        name: 'J+ Medellín',
        short_name: 'J+',
        description:
          'Discipulados, comunidad y contenido para tu crecimiento espiritual.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A0A0A',
        theme_color: '#0A0A0A',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Eventos',
            short_name: 'Eventos',
            url: '/eventos',
            icons: [{ src: '/icons/shortcut-eventos.png', sizes: '96x96' }],
          },
          {
            name: 'Discipulados',
            short_name: 'Cursos',
            url: '/discipulados',
            icons: [
              { src: '/icons/shortcut-discipulados.png', sizes: '96x96' },
            ],
          },
          {
            name: 'Media',
            short_name: 'Media',
            url: '/media',
            icons: [{ src: '/icons/shortcut-media.png', sizes: '96x96' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        globIgnores: ['**/images/**'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
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
