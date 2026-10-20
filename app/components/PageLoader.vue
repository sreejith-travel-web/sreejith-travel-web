<!-- ~/app/components/PageLoader.vue -->

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const isFadingOut = ref(false)

let finishTimer: ReturnType<typeof setTimeout> | null = null
let unmountTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  document.body.style.overflow = 'hidden'

  // Triggers exactly 300ms faster (down to 700ms from 1000ms)
  finishTimer = setTimeout(() => {
    isFadingOut.value = true
    
    // Increased unmount buffer to 800ms! 
    // This gives the 700ms CSS fade plenty of time to reach true 0% opacity before the DOM node is destroyed.
    unmountTimer = setTimeout(() => {
      document.body.style.overflow = ''
      emit('complete')
    }, 700)
  }, 1000)
})

onBeforeUnmount(() => {
  if (finishTimer) clearTimeout(finishTimer)
  if (unmountTimer) clearTimeout(unmountTimer)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    :class="[
      'fixed inset-0 z-10000 bg-bg-dark flex justify-center items-center overflow-hidden transition-opacity duration-700 ease-in-out',
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]"
    @touchmove.prevent
    @wheel.prevent
  >
    <!-- Atmospheric Glow: Pure CSS Animation -->
    <div 
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-journey-blue)_15%,transparent)_0%,var(--color-bg-dark)_65%)] animate-glow" 
    />

    <!-- Composed Mark + Text: Pure CSS Animation -->
    <div class="relative z-10 flex flex-col items-center gap-3 w-48 sm:w-64 md:w-72 text-warm-gold animate-slide-up">
      <div class="w-36 sm:w-48 md:w-56">
        <SvgLogoMark :draw="true" />
      </div>
      <div class="w-full">
        <SvgLogoText :draw="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-glow {
  animation: glowFade 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: logoSlide 0.6s ease-out forwards;
}

@keyframes glowFade {
  0% { opacity: 0; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes logoSlide {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>