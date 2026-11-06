<!-- ~/app/components/PageLoader.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

let fallbackTimer: ReturnType<typeof setTimeout> | null = null
let done = false

const triggerComplete = () => {
  if (done) return
  done = true
  if (fallbackTimer) clearTimeout(fallbackTimer)
  emit('complete')
}

onMounted(() => {
  // Failsafe in case browser tab was backgrounded or animations are disabled
  fallbackTimer = setTimeout(triggerComplete, 900)
})

onBeforeUnmount(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
})
</script>

<template>
  <div
    class="loader fixed inset-0 z-99999 bg-bg-dark flex justify-center items-center overflow-hidden"
    @touchmove.prevent
    @wheel.prevent
  >
    <!-- Master CSS Timer: When this 0.75s glow finishes, it immediately triggers the fade-out in app.vue -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-journey-blue)_18%,transparent)_0%,var(--color-bg-dark)_65%)] animate-glow"
      @animationend.self="triggerComplete"
    />

    <!-- Composed Mark + Text (Finishes drawing at ~0.72s on the exact same CSS clock) -->
    <div class="relative z-10 flex flex-col items-center gap-3 w-48 sm:w-64 md:w-72 text-warm-gold animate-slide-up">
      <div class="w-36 sm:w-48 md:w-56">
        <SvgLogoMark :draw="true" :duration-ms="650" :stagger-ms="8" />
      </div>
      <div class="w-full">
        <SvgLogoText :draw="true" :duration-ms="520" :stagger-ms="4" :base-delay-ms="80" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* EDIT THIS DURATION (0.75s) to control exactly when the loader starts fading out */
.animate-glow {
  opacity: 0;
  animation: glowFade 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: logoSlide 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes glowFade {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes logoSlide {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>