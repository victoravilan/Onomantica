import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const target = process.env.VITE_TARGET ?? 'web' // 'web' | 'android'

  const plugins = [react()]

  // ✅ Solo activamos PWA para producción web
  if (isProd && target === 'web') {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        },
        manifest: {
          name: 'Onomántica',
          short_name: 'Onomántica',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#0b1220',
          theme_color: '#0b1220',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        devOptions: { enabled: false } // 🔕 SW desactivado en dev
      })
    )
  }

  return {
    plugins,
    server: { port: 5173, open: false }
  }
})
