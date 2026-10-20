import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Force App directory mode
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2024-11-01',
  
  // 1. Wire up Tailwind v4 via Vite
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/fonts',
    '@vueuse/motion/nuxt'
  ],

  // Google Fonts Configuration (Lightweight & optimized for zero CLS)
  fonts: {
    defaults: {
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Lato', provider: 'google', weights: [300, 400, 600, 700], global: true },
      { name: 'Josefin Sans', provider: 'google', weights: [400, 500, 600], global: true },
      { name: 'Square Peg', provider: 'google', weights: [400], global: true }
    ]
  },

  nitro: {
    compressPublicAssets: true
  },
  
  // 2. Point to our master CSS file
  css: ['~/assets/css/main.css'],
    
  // 3. Enable VueUse & Motion for SSR
  build: {
    transpile: ['@vueuse/motion']
  },

  app: {
    baseURL: '/',
    pageTransition: { 
      name: 'page', 
      mode: 'out-in' 
    },
  },

  ssr: true,
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3003
  },

})