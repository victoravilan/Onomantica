import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['img/**/*'], // Incluye todos los archivos de la carpeta img
      manifest: {
        name: 'Onomántica',
        short_name: 'Onomántica',
        description: 'Análisis onomástico y relatos de nombres.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#1e293b',
        orientation: 'portrait',
        icons: [
          { src: '/img/icon-80.png',  sizes: '80x80',  type: 'image/png' },
          { src: '/img/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/img/favicon.ico',  sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' }
        ]
      },
      workbox: {
        // No metas JSON grandes en el pre-cache:
        // (solo js/css/html/media…)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],

        // Cachea el dataset en RUNTIME (al primer fetch), no en el build:
        runtimeCaching: [
          {
            // Si quieres cachear específicamente el dataset:
            urlPattern: ({ url }) => url.pathname.startsWith('/data/nombres_completos.json'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'dataset-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              }
            }
          }
        ],

        // (opcional) si aún así quisieras permitir archivos grandes:
        // maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      }
    })
  ],
  server: {
    // Si usas vercel dev para /api, puedes habilitar esto:
    // proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } }
  }
})
