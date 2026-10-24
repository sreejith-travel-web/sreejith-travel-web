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
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      // 1. Primary body typography (Critical)
      { 
        name: 'Lato', 
        provider: 'google', 
        styles: ['normal'], 
        weights: [400, 500, 600], 
        global: true,
        preload: true 
      },
      // 2. Eyebrows & UI buttons (Critical Hero)
      { 
        name: 'Josefin Sans', 
        provider: 'google', 
        styles: ['normal'], 
        weights: [500, 600], 
        global: true,
        preload: true 
      },
      // 3. Hero Script Headline (Critical Hero - Preloaded)
      { 
        name: 'Square Peg', 
        provider: 'google', 
        styles: ['normal'], 
        weights: [400], 
        global: true,
        preload: true 
      },
      // 4. Testimonials/Quotes only (Below-the-fold - Deferred)
      { 
        name: 'Cormorant Garamond', 
        provider: 'google', 
        weights: [600], 
        styles: ['italic'], 
        global: true,
        preload: false 
      }
    ]
  },

  motion: {
    directives: {
      // 1. Standard text, paragraphs, buttons, and quotes (Y: 30, 700ms)
      'fade-up': {
        initial: { opacity: 0, y: 30 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 700, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 2. Grid cards (Masonry, Categories, Stats - 500ms for swift staggering)
      'stagger-card': {
        initial: { opacity: 0, y: 30 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 3. Micro-UI like dot pagination (Y: 20, 500ms)
      'micro-up': {
        initial: { opacity: 0, y: 20 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, ease: [0.22, 1, 0.36, 1] }
        }
      }
    }
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

  // 4. Inline CSS to eliminate render-blocking and font-chaining delays
  features: {
    inlineStyles: true
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Sreejith Travel | Bespoke Luxury Travel Designer',
      meta: [
        { name: 'description', content: 'Designing luxury bespoke journeys bringing together meaningful experiences and authentic stories in India.' }
      ]
    },
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