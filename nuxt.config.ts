// nuxt.config.ts
import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const itinerariesDir = path.resolve(process.cwd(), 'server/data/itineraries')
const itinerarySitemapUrls = fs.existsSync(itinerariesDir)
  ? fs
      .readdirSync(itinerariesDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({
        loc: `/itineraries/${file.replace(/\.json$/, '')}`,
        changefreq: 'monthly' as const,
        priority: 0.8 as const
      }))
  : []

export default defineNuxtConfig({
  // Force App directory mode
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-01',

  // 1. Site Configuration for Sitemap, Robots & Canonical Authority (Strict non-www)
  site: {
    url: 'https://sreejithtravel.com',
    name: 'Sree Jith Travel',
  },

  // 2. Wire up Tailwind v4 via Vite
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        'lenis',
      ],
    },
  },

  // 3. Modules (Fonts, Motion, Sitemap & Robots)
  modules: [
    '@nuxt/fonts',
    '@vueuse/motion/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // 4. Google Fonts Configuration (Lightweight & optimized for zero CLS)
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
        preload: true,
      },
      // 2. Eyebrows & UI buttons (Critical Hero)
      {
        name: 'Josefin Sans',
        provider: 'google',
        styles: ['normal'],
        weights: [500, 600],
        global: true,
        preload: true,
      },
      // 3. Hero Script Headline (Critical Hero - Preloaded)
      {
        name: 'Square Peg',
        provider: 'google',
        styles: ['normal'],
        weights: [400],
        global: true,
        preload: true,
      },
      // 4. Testimonials/Quotes only (Below-the-fold - Deferred)
      {
        name: 'Cormorant Garamond',
        provider: 'google',
        weights: [600],
        styles: ['italic'],
        global: true,
        preload: false,
      },
    ],
  },

  // 5. Custom Motion Directives
  motion: {
    directives: {
      // 1. Standard section text, paragraphs, buttons, and quotes
      'fade-up': {
        initial: { opacity: 0, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 700, ease: [0.22, 1, 0.36, 1] },
        },
      },

      // 2. Hero fade-up option (100% opacity for FCP/LCP)
      'hero-fade-up': {
        initial: { opacity: 1, y: 36 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 850, ease: [0.22, 1, 0.36, 1] },
        },
      },

      // 3. Hero Counter-Scale Lift (0.92 -> 1.0, 100% opacity for instant FCP/LCP)
      'hero-scale-in': {
        initial: {
          opacity: 1,
          y: 28,
          scale: 0.92,
        },
        visibleOnce: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 850,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      },

      // 4. Grid cards (Categories, Itineraries, Journal, Stats)
      'stagger-card': {
        initial: { opacity: 0, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 600, ease: [0.22, 1, 0.36, 1] },
        },
      },

      // 5. Micro-UI elements
      'micro-up': {
        initial: { opacity: 0, y: 16 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, ease: [0.22, 1, 0.36, 1] },
        },
      },

      // 6. Hero Micro-UI (Slider dots & award badge - clamped to y: 24 so it never clips hero bottom)
      'hero-micro-up': {
        initial: { opacity: 1, y: 24 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 700, ease: [0.22, 1, 0.36, 1] },
        },
      },
    },
  },

  // 6. Sitemap Configuration (All 11 Core Routes + Dynamic Slugs Ready)
  sitemap: {
    zeroRuntime: true,
    urls: [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.8 },
      { loc: '/itineraries', changefreq: 'weekly', priority: 0.9 },
      { loc: '/partner', changefreq: 'monthly', priority: 0.8 },
      { loc: '/impact', changefreq: 'monthly', priority: 0.8 },
      { loc: '/journal', changefreq: 'weekly', priority: 0.8 },
      { loc: '/planYourJourney', changefreq: 'monthly', priority: 0.9 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.8 },
      { loc: '/faq', changefreq: 'monthly', priority: 0.7 },
      { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
      { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
      ...itinerarySitemapUrls
    ]
  },

  // 7. Robots.txt Configuration
  robots: {
    disallow: [],
    sitemap: ['https://sreejithtravel.com/sitemap.xml'],
  },

  // 8. Static Prerendering Route Rules
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/itineraries': { prerender: true },
    '/itineraries/**': { prerender: true },
    '/partner': { prerender: true },
    '/impact': { prerender: true },
    '/journal': { prerender: true },
    '/journal/**': { prerender: true },
    '/planYourJourney': { prerender: true },
    '/contact': { prerender: true },
    '/faq': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
  },

  // 9. Nitro Asset Compression & Crawler Prerendering
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/itineraries', '/journal'],
    },
  },

  // 10. Payload Extraction for Instant Client-Side Navigation
  experimental: {
    payloadExtraction: true,
  },

  // 11. Point to Master CSS File
  css: ['~/assets/css/main.css'],

  // 12. Enable VueUse & Motion for SSR
  build: {
    transpile: ['@vueuse/motion'],
  },

  // 13. Inline CSS to Eliminate Render-Blocking & Font-Chaining Delays
  features: {
    inlineStyles: true,
  },

  // 14. Global Head, Geo Coordinates, 1200x630 JPG OG Standards & Favicons
  app: {
    baseURL: '/',
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Sree Jith Travel | Bespoke Luxury Travel Experience Designer',

      htmlAttrs: {
        lang: 'en',
      },

      meta: [
        {
          name: 'description',
          content:
            'Designing luxury bespoke journeys bringing together meaningful experiences and authentic stories across Kerala and South India.',
        },
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        { name: 'author', content: 'kriz - https://brandsta.in' },
        { name: 'application-name', content: 'Sree Jith Travel' },

        // Local Business Geographic Coordinates (Kakkayur, Palakkad, Kerala)
        { name: 'geo.region', content: 'IN-KL' },
        { name: 'geo.placename', content: 'Kakkayur, Palakkad, Kerala' },
        { name: 'geo.position', content: '10.6566728;76.6299029' },
        { name: 'ICBM', content: '10.6566728, 76.6299029' },

        // Global Social Layout Standards (1200x630 JPG)
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:site_name', content: 'Sree Jith Travel' },
        { property: 'og:image', content: 'https://sreejithtravel.com/images/favicons/sreejith-og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://sreejithtravel.com/images/favicons/sreejith-og-image.jpg' },

        // Windows PWA & Mobile Meta Tags
        { name: 'msapplication-TileColor', content: '#051b3b' },
        { name: 'msapplication-TileImage', content: '/images/favicons/ms-icon-144x144.png' },
        { name: 'theme-color', content: '#051b3b' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },

        // PWA & Mobile Device Customizations
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Sree Jith Travel' },
      ],

      link: [
        // Apple Touch Icons
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/images/favicons/apple-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/images/favicons/apple-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/images/favicons/apple-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/images/favicons/apple-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/images/favicons/apple-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/images/favicons/apple-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/images/favicons/apple-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/images/favicons/apple-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicons/apple-icon-180x180.png' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/images/favicons/apple-icon.png' },
        { rel: 'apple-touch-icon', sizes: '190x190', href: '/images/favicons/apple-icon-precomposed.png' },
        // Standard Favicons
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/favicons/android-icon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/images/favicons/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicons/favicon-16x16.png' },
        // Web Manifest
        { rel: 'manifest', crossorigin: 'use-credentials', href: '/manifest.json' },
      ],
    },
  },

  ssr: true,
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3003,
  },
})