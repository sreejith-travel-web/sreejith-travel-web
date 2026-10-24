<!-- ~/app/app.vue -->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'

const nuxtApp = useNuxtApp()
const isInitialAppLoad = useInitialAppLoad()

useHead({
  htmlAttrs: {
    // Using a getter function () => ensures Nuxt updates the DOM instantly
    class: () => isInitialAppLoad.value ? 'is-loading' : ''
  }
})

const isRouting = ref(false)
let routeLoadStartTime = 0
const MIN_LOADER_DURATION = 900
let lenis: Lenis | undefined

const handleLoaderComplete = () => {
  isInitialAppLoad.value = false
}

nuxtApp.hook('page:start', () => {
  routeLoadStartTime = Date.now()
  isRouting.value = true
})

nuxtApp.hook('page:finish', () => {
  const elapsedTime = Date.now() - routeLoadStartTime
  const remainingTime = Math.max(0, MIN_LOADER_DURATION - elapsedTime)

  setTimeout(() => {
    isRouting.value = false
    
    // Force Lenis to recalculate page height after the route transition finishes
    if (lenis) {
      setTimeout(() => lenis!.resize(), 50)
    }
  }, remainingTime + 100)
})

onMounted(() => {
  // Unlocks CSS :active pseudo-classes on iOS Safari/Mobile
  document.body.addEventListener('touchstart', () => {}, { passive: true })

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  // Initialize Lenis Cinematic Smooth Scrolling
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  })

  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
})

onBeforeUnmount(() => {
  if (lenis) {
    lenis.destroy()
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg-light text-primary-light relative">
    
    <!-- Route Transition Weaving Mark -->
    <Transition name="fade-logo">
      <div
        v-if="isRouting"
        class="fixed inset-0 z-9000 flex items-center justify-center overflow-hidden pointer-events-none bg-bg-light"
      >
        <div class="w-36 sm:w-48 h-auto text-intention-blue">
          <SvgLogoMark :draw="true" :duration-ms="600" :stagger-ms="10" />
        </div>
      </div>
    </Transition>

    <!-- Initial Full Brand Loader -->
    <PageLoader v-if="isInitialAppLoad" @complete="handleLoaderComplete" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, filter 0.7s var(--ease-editorial);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  filter: blur(4px) brightness(0.9);
}

.fade-logo-enter-active,
.fade-logo-leave-active {
  transition: opacity 0.5s ease;
}

.fade-logo-enter-from,
.fade-logo-leave-to {
  opacity: 0;
}
</style>