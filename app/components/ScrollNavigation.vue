<!-- ~/components/ScrollNavigation.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isAtBottom = ref(false)
const isLoaderFinished = useInitialAppLoad() // Assumes auto-imported composable

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 100
  isAtBottom.value = scrollPosition >= threshold
}

const toggleScroll = () => {
  if (isAtBottom.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: document.documentElement.offsetHeight, behavior: 'smooth' })
  }
}

onMounted(() => {
  // Use passive listener for better scroll performance (Core Web Vitals)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <button 
    v-if="isLoaderFinished"
    v-motion
    :initial="{ opacity: 0, scale: 0.8, y: 20 }"
    :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 1000, ease: [0.25, 1, 0.5, 1], delay: 2000 } }"
    @click="toggleScroll"
    class="fixed bottom-3 right-3 sm:bottom-4 sm:right-6 md:bottom-6 md:right-8 z-50 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-darker-gold text-surface-light shadow-lg flex items-center justify-center hover:bg-dark-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue transition-colors duration-300 ease-out group overflow-hidden"
    :aria-label="isAtBottom ? 'Scroll to top' : 'Scroll to bottom'"
  >
    <div class="relative w-full h-full flex items-center justify-center transform transition-transform duration-300 ease-editorial">
      <!-- Chevron Down -->
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 absolute transition-all duration-500" 
        :class="isAtBottom ? 'opacity-0 translate-y-4 scale-50' : 'opacity-100 translate-y-0 scale-100 group-hover:translate-y-1'"
      >
        <path d="M6 9l6 6 6-6"></path>
      </svg>
      <!-- Chevron Up -->
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 absolute transition-all duration-500" 
        :class="isAtBottom ? 'opacity-100 translate-y-0 scale-100 group-hover:-translate-y-1' : 'opacity-0 -translate-y-4 scale-50'"
      >
        <path d="M18 15l-6-6-6 6"></path>
      </svg>
    </div>
  </button>
</template>