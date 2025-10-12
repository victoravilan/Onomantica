import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Onomántica',
        short_name: 'Onomántica',
        description: 'Análisis onomástico y relatos de nombres.',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        icons: [
          { src: '/img/icon-80.png', sizes: '80x80', type: 'image/png' },
          { src: '/img/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/img/favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' }
        ]
      }
    })
  ]
})
