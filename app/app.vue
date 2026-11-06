<!-- ~/app/app.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'

const nuxtApp = useNuxtApp()
const isLoading = ref(true)
const isInitialAppLoad = useInitialAppLoad()

const isRouting = ref(false)
let routeLoadStartTime = 0
const MIN_ROUTE_TIME = 550

let lenis: Lenis | undefined
let rafId: number | null = null

// Triggered by PageLoader the exact millisecond the CSS logo draw completes
const finishInitialLoad = () => {
  if (!isLoading.value) return
  isLoading.value = false
  isInitialAppLoad.value = false
  lenis?.start()
  setTimeout(() => lenis?.resize(), 50)
}

nuxtApp.hook('page:start', () => {
  if (isLoading.value) return
  routeLoadStartTime = Date.now()
  isRouting.value = true
  lenis?.stop()
})

nuxtApp.hook('page:finish', () => {
  if (isLoading.value) return
  const elapsedTime = Date.now() - routeLoadStartTime
  const remainingTime = Math.max(0, MIN_ROUTE_TIME - elapsedTime)

  setTimeout(() => {
    isRouting.value = false

    window.scrollTo(0, 0)
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
      lenis.start()
      setTimeout(() => lenis?.resize(), 50)
    }
  }, remainingTime)
})

onMounted(() => {
  document.body.addEventListener('touchstart', () => {}, { passive: true })

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true
  })

  if (isLoading.value) {
    lenis.stop()
  }

  function raf(time: number) {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenis) {
    lenis.destroy()
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg-light text-primary-light relative">
    <!-- 1. Initial Full Brand Loader (type="transition" ignores child SVG keyframes) -->
    <Transition name="fade" type="transition">
      <PageLoader v-if="isLoading" @complete="finishInitialLoad" />
    </Transition>

    <!-- 2. Route Transition Weaving Mark -->
    <Transition name="fade" type="transition">
      <div
        v-if="isRouting"
        class="loader fixed inset-0 z-99999 flex items-center justify-center overflow-hidden pointer-events-none bg-bg-light"
      >
        <div class="w-36 sm:w-48 h-auto text-intention-blue">
          <SvgLogoMark :draw="true" :duration-ms="550" :stagger-ms="7" />
        </div>
      </div>
    </Transition>

    <!-- 3. Main Layout & Cached Pages -->
    <NuxtLayout>
      <NuxtPage :keepalive="{ max: 10 }" />
    </NuxtLayout>
  </div>
</template>

<style>
body:has(.loader) {
  overflow: hidden;
}

.fade-enter-active {
  transition: opacity 0.18s ease;
}

.fade-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease-in-out, filter 0.4s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(6px);
}

a, button, [role="button"], input, select, textarea {
  touch-action: manipulation;
}
</style>