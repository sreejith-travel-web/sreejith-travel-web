<!-- ~/components/QuickActions.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const isLoaderFinished = useInitialAppLoad() // Assumes auto-imported composable
</script>

<template>
  <div 
    v-if="isLoaderFinished"
    v-motion
    :initial="{ opacity: 0, scale: 0.85 }"
    :enter="{ opacity: 1, scale: 1, transition: { duration: 600, ease: [0.34, 1.56, 0.64, 1], delay: 1200 } }"
    class="fixed bottom-14 right-3 sm:bottom-16 sm:right-4 md:bottom-20 md:right-6 z-90 flex flex-col items-center p-1.5 sm:p-2 rounded-full bg-journey-deep/60 backdrop-blur-md border border-surface-light/10 shadow-2xl gap-2 md:gap-3"
  >
    
    <!-- WhatsApp Button -->
    <a 
      href="https://wa.me/919943360478" 
      target="_blank"
      rel="noopener noreferrer"
      class="group flex flex-col items-center gap-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue rounded-full"
      aria-label="Chat on WhatsApp"
    >
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.5 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 500, ease: [0.34, 1.56, 0.64, 1], delay: 1300 } }"
        class="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-[#25D366] text-surface-light shadow-md flex items-center justify-center rounded-full transition-transform hover:scale-110 duration-300"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0 transition-transform hover:scale-110 duration-300">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <span 
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 1600 } }"
        class="text-[9px] font-sans font-medium text-surface-light/80 uppercase tracking-wider"
      >
        Chat
      </span>
    </a>

    <!-- Divider -->
    <div 
      v-if="route.path !== '/planyourjourney' && route.path !== '/planyourjourney/'" 
      v-motion
      :initial="{ opacity: 0, scaleY: 0 }"
      :enter="{ opacity: 1, scaleY: 1, transition: { duration: 300, delay: 1500 } }"
      class="w-5 sm:w-6 h-px bg-surface-light/15"
    ></div>

    <!-- Plan Your Journey Button -->
    <NuxtLink 
      v-if="route.path !== '/planyourjourney' && route.path !== '/planyourjourney/'"
      to="/planyourjourney"
      class="group flex flex-col items-center gap-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue rounded-full"
      aria-label="Plan Your Journey"
    >
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.5 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 500, ease: [0.34, 1.56, 0.64, 1], delay: 1400 } }"
        class="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-surface-light text-journey-deep shadow-md flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-300"
      >
        <svg viewBox="0 0 122.88 103.44" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0 transform transition-transform hover:scale-105 duration-300">
          <g><path d="M69.49,102.77L49.8,84.04l-20.23,18.27c-0.45,0.49-1.09,0.79-1.8,0.79c-1.35,0-2.44-1.09-2.44-2.44V60.77L0.76,37.41 c-0.98-0.93-1.01-2.47-0.09-3.45c0.31-0.33,0.7-0.55,1.11-0.67l0,0l118-33.2c1.3-0.36,2.64,0.39,3.01,1.69 c0.19,0.66,0.08,1.34-0.24,1.89l-49.2,98.42c-0.6,1.2-2.06,1.69-3.26,1.09C69.86,103.07,69.66,102.93,69.49,102.77L69.49,102.77 L69.49,102.77z M46.26,80.68L30.21,65.42v29.76L46.26,80.68L46.26,80.68z M28.15,56.73l76.32-47.26L7.22,36.83L28.15,56.73 L28.15,56.73z M114.43,9.03L31.79,60.19l38.67,36.78L114.43,9.03L114.43,9.03z"/></g>
        </svg>
      </div>
      <span 
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 1700 } }"
        class="text-[9px] font-sans font-medium text-surface-light/80 uppercase tracking-wider"
      >
        Plan
      </span>
    </NuxtLink>
    
  </div>
</template>