import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  // 1. Wire up Tailwind v4 via Vite
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  // 2. Point to our master CSS file
  css: ['~/assets/css/main.css'],
  
  // 3. Enable VueUse & Motion for SSR
  build: {
    transpile: ['@vueuse/motion']
  }
})