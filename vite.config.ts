import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Nota: los íconos deben estar en public/img/...
// public/
//   manifest.webmanifest (opcional si usas el del plugin)
//   img/icon-80.png, icon-192.png, icon-512.png, favicon.ico

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // incluye íconos para cache inicial
      includeAssets: [
        'img/favicon.ico',
        'img/icon-80.png',
        'img/icon-192.png',
        'img/icon-512.png',
        'img/logo-onomantica.png'
      ],
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
        // cachea JSON, imágenes y fuentes para modo offline “decente”
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json,woff2}'],
      }
    })
  ],
  server: {
    // si más adelante usas vercel dev y quieres proxy de /api:
    // proxy: {
    //   '/api': { target: 'http://localhost:3000', changeOrigin: true }
    // }
  }
})
