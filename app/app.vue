<!-- ~/app/app.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
const MIN_LOADER_DURATION = 1000

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
  }, remainingTime + 100)
})

onMounted(() => {
  // Unlocks CSS :active pseudo-classes on iOS Safari/Mobile
  document.body.addEventListener('touchstart', () => {}, { passive: true })

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
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
  transition: opacity 0.5s ease, filter 0.8s var(--ease-editorial);
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