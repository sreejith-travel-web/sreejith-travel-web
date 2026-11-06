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
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        'lenis'
      ],
    }
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
      // 1. Standard section text, paragraphs, buttons, and quotes
      'fade-up': {
        initial: { opacity: 0, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 700, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 2. Hero fade-up option (100% opacity for FCP/LCP)
      'hero-fade-up': {
        initial: { opacity: 1, y: 36 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 850, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 3. Hero Counter-Scale Lift (0.92 -> 1.0, 100% opacity for instant FCP/LCP)
      'hero-scale-in': {
        initial: {
          opacity: 1,
          y: 28,
          scale: 0.92
        },
        visibleOnce: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 850,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      },

      // 4. Grid cards (Categories, Itineraries, Journal, Stats)
      'stagger-card': {
        initial: { opacity: 0, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 600, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 5. Micro-UI elements
      'micro-up': {
        initial: { opacity: 0, y: 16 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, ease: [0.22, 1, 0.36, 1] }
        }
      },

      // 6. Hero Micro-UI (Slider dots & award badge - clamped to y: 24 so it never clips hero bottom)
      'hero-micro-up': {
        initial: { opacity: 1, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 700, ease: [0.22, 1, 0.36, 1] }
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