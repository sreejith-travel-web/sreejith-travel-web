<!-- ~/app/app.vue -->
<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp, useRouter, useRoute } from '#imports'
import Lenis from 'lenis'
import { useSessionScroll } from '~/composables/useSessionScroll'

const nuxtApp = useNuxtApp()
const router = useRouter()
const route = useRoute()

const {
  normalizeScrollKey,
  saveScrollPosition,
  getSavedScrollPosition,
  setActiveRouteAlias,
  getActiveRouteAlias
} = useSessionScroll()

const isLoading = ref(true)
const isInitialAppLoad = useInitialAppLoad()

const isRouting = ref(false)
let routeLoadStartTime = 0
const MIN_ROUTE_TIME = 550

let lenis: Lenis | undefined
const lenisState = useState<Lenis | null>('lenis-instance', () => null)
let rafId: number | null = null
let removeBeforeEachGuard: (() => void) | null = null

// Passive in-memory scroll tracker (zero DOM reflow, locked during route curtains)
let liveScrollY = 0
let isRestoringScroll = false
let pendingTargetKey = '/'

const onPassiveScroll = () => {
  if (isLoading.value || isRouting.value || isRestoringScroll) return
  liveScrollY = window.scrollY || 0
}

const applyInstantScroll = (targetY: number) => {
  try {
    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' as ScrollBehavior })
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(targetY, { immediate: true })
    }
  } catch {
    window.scrollTo(0, targetY)
  }
}

// Triggered by PageLoader the exact millisecond the CSS logo draw completes
const finishInitialLoad = () => {
  if (!isLoading.value) return
  isLoading.value = false
  isInitialAppLoad.value = false
  liveScrollY = window.scrollY || 0
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

  setTimeout(async () => {
    isRestoringScroll = true
    isRouting.value = false

    // Wait 1 tick so .fade-leave-active unlocks body overflow before scrolling
    await nextTick()

    const activeAlias = getActiveRouteAlias()
    const lookupKey = pendingTargetKey || normalizeScrollKey(route.path)
    const savedY =
      getSavedScrollPosition(lookupKey) ??
      (activeAlias ? getSavedScrollPosition(activeAlias) : undefined)
    const targetY = savedY ?? 0

    lenis?.start()
    applyInstantScroll(targetY)

    // Secondary verification pass once KeepAlive / hydrate-on-visible settles
    setTimeout(() => {
      try {
        lenis?.resize()
        if (targetY > 0 && Math.abs((window.scrollY || 0) - targetY) > 4) {
          applyInstantScroll(targetY)
        }
      } catch {
        // Non-blocking fallback
      } finally {
        liveScrollY = window.scrollY || 0
        isRestoringScroll = false
        window.dispatchEvent(new Event('scroll'))
      }
    }, 60)
  }, remainingTime)
})

onMounted(() => {
  document.body.addEventListener('touchstart', () => {}, { passive: true })
  window.addEventListener('scroll', onPassiveScroll, { passive: true })

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  liveScrollY = 0
  pendingTargetKey = normalizeScrollKey(route.path)

  // Snapshot outgoing route scroll BEFORE DOM unmounts or popstate settles
  removeBeforeEachGuard = router.beforeEach((to, from) => {
    const outgoingY = Math.max(0, liveScrollY || window.scrollY || 0)
    const fromKey = normalizeScrollKey(from.path)
    const aliasKey = getActiveRouteAlias()

    saveScrollPosition(fromKey, outgoingY)
    if (aliasKey && aliasKey !== fromKey) {
      saveScrollPosition(aliasKey, outgoingY)
    }

    setActiveRouteAlias(null)
    pendingTargetKey = normalizeScrollKey(to.path)
  })

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true
  })

  lenisState.value = lenis

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
  window.removeEventListener('scroll', onPassiveScroll)
  if (removeBeforeEachGuard) {
    removeBeforeEachGuard()
    removeBeforeEachGuard = null
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenis) {
    lenis.destroy()
    lenisState.value = null
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
/* Releases overflow lock the exact millisecond fade-out begins so restored scrollY never clamps */
body:has(.loader:not(.fade-leave-active)) {
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