import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base path: '/' for root hosts (Netlify, custom domain); '/gk-quest/' for
// GitHub Pages (which serves at username.github.io/gk-quest/). The Pages build
// sets PAGES_BASE=/gk-quest/; everything else stays at root. import.meta.env.BASE_URL
// is derived from this and used by the router + PWA so links resolve correctly.
const base = process.env.PAGES_BASE || '/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'GK Quest',
        short_name: 'GK Quest',
        description: '90-day gamified General Knowledge adventure for kids.',
        theme_color: '#7c3aed',
        background_color: '#7c3aed',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        id: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole app shell + every code-split day chunk so the app
        // (and all question data) works fully offline after first load.
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
        navigateFallback: base + 'index.html',
        runtimeCaching: [
          {
            // Cache Google Fonts so the playful fonts survive offline too.
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' ||
              url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    open: false,
  },
})
