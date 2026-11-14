// ~/app/composables/useFloatingControls.ts
import { computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useState, useRoute } from '#imports'
import type Lenis from 'lenis'

export type DockSurfaceTheme = 'light' | 'dark'

interface CachedThemeBand {
  top: number
  bottom: number
  theme: DockSurfaceTheme
}

interface PageFloatingOverride {
  path: string
  scrollNav?: boolean | null
  actionDock?: boolean | null
}

// Itinerary listing, collection & category slugs that KEEP ScrollNav + FloatingActionDock
const ITINERARY_COLLECTION_SLUGS = new Set([
  'signature',
  'collaborated',
  'categories',
  'category',
  'styles',
  'style',
  'all',
  'culture',
  'cultural',
  'nature',
  'wellness',
  'offbeat',
  'bespoke',
  'culinary',
  'wildlife',
  'heritage',
  'community',
  'regenerative',
  'slow-travel'
])

// Journal listing, tab & subcategory slugs that KEEP ScrollNav + FloatingActionDock
const JOURNAL_COLLECTION_SLUGS = new Set([
  'all',
  'insights',
  'stories',
  'articles',
  'category',
  'categories',
  'subcategory',
  'subcategories',
  'tag',
  'tags',
  'field-notes',
  'living-heritage',
  'responsible-travel',
  'research-perspectives',
  'ideas-collaborations',
  'people-communities',
  'journey-stories',
  'travel-experiences',
  'traveller-stories',
  'case-studies'
])

const SCROLL_PACE_CONFIG = {
  bottomThresholdPx: 96,
  minScrollableDeltaPx: 140,
  // Constant physical cruising speed (~1750px/sec) scaled by travel distance
  pixelsPerSecond: 1750,
  minDurationSec: 0.95,
  maxDurationSec: 5.2
} as const

const normalizePath = (p: string): string =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p

const classifyRouteSegments = (rawPath: string) => {
  const cleanPath = normalizePath(rawPath).toLowerCase()
  const segments = cleanPath.split('/').filter(Boolean)
  const first = segments[0] || ''
  const second = segments[1] || ''

  const isItinerarySingle =
    first === 'itineraries' &&
    segments.length >= 2 &&
    second !== 'category' &&
    second !== 'categories' &&
    second !== 'styles' &&
    second !== 'style' &&
    !(segments.length === 2 && ITINERARY_COLLECTION_SLUGS.has(second))

  const isExplicitListicleRoute =
    (first === 'listicle' || first === 'listicles') && segments.length >= 1 ||
    (first === 'journal' && (second === 'listicle' || second === 'listicles') && segments.length >= 3)

  const isJournalSingle =
    isExplicitListicleRoute ||
    (first === 'journal' &&
      segments.length >= 2 &&
      second !== 'category' &&
      second !== 'categories' &&
      second !== 'subcategory' &&
      second !== 'subcategories' &&
      second !== 'tag' &&
      second !== 'tags' &&
      !(segments.length === 2 && JOURNAL_COLLECTION_SLUGS.has(second)))

  return {
    cleanPath,
    isItinerarySingle,
    isJournalSingle,
    isExplicitListicleRoute
  }
}

// Silk ease-in-out curve for unhurried distance-proportional gliding
const easeInOutSilk = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

let activeConsumers = 0
let cachedMaxScroll = 1
let cachedViewportH = 800
let cachedViewportW = 1280
let themeBands: CachedThemeBand[] = []
let scrollRafPending = false
let fallbackScrollRafId: number | null = null
let resizeObserver: ResizeObserver | null = null
let settleTimerId: ReturnType<typeof setTimeout> | null = null

const parseRgbLuminance = (bg: string): number | null => {
  const match = bg.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/)
  if (!match) return null
  const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1
  if (alpha < 0.35) return null
  const r = Number(match[1]) / 255
  const g = Number(match[2]) / 255
  const b = Number(match[3]) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const useFloatingControls = () => {
  const route = useRoute()
  const lenisState = useState<Lenis | null>('lenis-instance', () => null)

  const isScrollable = useState<boolean>('floating-is-scrollable', () => true)
  const isAtBottom = useState<boolean>('floating-is-at-bottom', () => false)
  const scrollNavTheme = useState<DockSurfaceTheme>('floating-scroll-theme', () => 'light')
  const actionDockTheme = useState<DockSurfaceTheme>('floating-dock-theme', () => 'light')
  const dockRouteOverride = useState<boolean | null>('floating-dock-override', () => null)
  const pageOverride = useState<PageFloatingOverride | null>('floating-page-override', () => null)

  // Path-bound override so dynamic pages (e.g. Listicle vs Article in [slug].vue) never hit route race conditions
  const setPageFloatingOverrides = (overrides: {
    scrollNav?: boolean | null
    actionDock?: boolean | null
  }) => {
    pageOverride.value = {
      path: normalizePath(route.path).toLowerCase(),
      ...overrides
    }
  }

  // Hidden on Itinerary Single View, Journal Article Single View, and Listicle Single View
  const isScrollNavAllowed = computed<boolean>(() => {
    const { cleanPath, isItinerarySingle, isJournalSingle } = classifyRouteSegments(route.path)
    if (pageOverride.value?.path === cleanPath && pageOverride.value.scrollNav != null) {
      return pageOverride.value.scrollNav
    }
    if (isItinerarySingle || isJournalSingle) {
      return false
    }
    return true
  })

  // Hidden on Itinerary Single View & Listicle Single View; Visible on Journal Article & all Listing pages
  const isActionDockAllowed = computed<boolean>(() => {
    const { cleanPath, isItinerarySingle, isExplicitListicleRoute } = classifyRouteSegments(route.path)
    if (pageOverride.value?.path === cleanPath && pageOverride.value.actionDock != null) {
      return pageOverride.value.actionDock
    }
    if (dockRouteOverride.value !== null) {
      return dockRouteOverride.value
    }
    if (isItinerarySingle || isExplicitListicleRoute) {
      return false
    }
    return true
  })

  const resolveThemeAtDocY = (docY: number): DockSurfaceTheme => {
    // Deepest matching section in DOM order wins
    for (let i = themeBands.length - 1; i >= 0; i--) {
      const band = themeBands[i]!
      if (docY >= band.top && docY <= band.bottom) {
        return band.theme
      }
    }
    return 'light'
  }

  const syncScrollFrame = () => {
    if (!import.meta.client) return
    const y = window.scrollY || window.pageYOffset || 0

    isAtBottom.value =
      isScrollable.value &&
      y >= cachedMaxScroll - SCROLL_PACE_CONFIG.bottomThresholdPx

    // Probe exact Y coordinates behind ScrollNav (~36px from bottom) & ActionDock (~92px from bottom)
    const isDockLowered =
      (!isScrollNavAllowed.value && cachedViewportW >= 1024) ||
      (isScrollNavAllowed.value && !isScrollable.value)
    const scrollProbeY = y + cachedViewportH - 36
    const dockProbeY = y + cachedViewportH - (isDockLowered ? 36 : 92)

    scrollNavTheme.value = resolveThemeAtDocY(scrollProbeY)
    actionDockTheme.value = resolveThemeAtDocY(dockProbeY)
  }

  const rebuildLayoutCache = () => {
    if (!import.meta.client) return
    const docEl = document.documentElement
    const y = window.scrollY || window.pageYOffset || 0
    cachedViewportH = window.innerHeight || 800
    cachedViewportW = window.innerWidth || 1280

    const rawMax = Math.max(0, docEl.scrollHeight - cachedViewportH)
    isScrollable.value = rawMax > SCROLL_PACE_CONFIG.minScrollableDeltaPx
    cachedMaxScroll = Math.max(1, rawMax)

    const candidates = document.querySelectorAll<HTMLElement>(
      '[data-theme], main > section, main > div, footer'
    )
    const nextBands: CachedThemeBand[] = []

    candidates.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.height < 24) return

      const explicit = el.getAttribute('data-theme')
      let resolved: DockSurfaceTheme | null = null

      if (explicit === 'dark' || explicit === 'light') {
        resolved = explicit
      } else {
        const lum = parseRgbLuminance(window.getComputedStyle(el).backgroundColor)
        if (lum !== null) {
          resolved = lum < 0.28 ? 'dark' : 'light'
        }
      }

      if (resolved) {
        nextBands.push({
          top: rect.top + y,
          bottom: rect.bottom + y,
          theme: resolved
        })
      }
    })

    themeBands = nextBands
    syncScrollFrame()
  }

  const cancelFallbackGlide = () => {
    if (fallbackScrollRafId !== null) {
      cancelAnimationFrame(fallbackScrollRafId)
      fallbackScrollRafId = null
    }
    if (import.meta.client) {
      window.removeEventListener('wheel', cancelFallbackGlide)
      window.removeEventListener('touchstart', cancelFallbackGlide)
      window.removeEventListener('keydown', cancelFallbackGlide)
    }
  }

  const onPassiveScroll = () => {
    if (scrollRafPending) return
    scrollRafPending = true
    requestAnimationFrame(() => {
      scrollRafPending = false
      syncScrollFrame()
    })
  }

  // Distance-proportional smooth scroll (Zero DOM reflow on click!)
  const scrollToBoundaryByPace = () => {
    if (!import.meta.client) return
    cancelFallbackGlide()

    const startY = window.scrollY || window.pageYOffset || 0
    const targetY = isAtBottom.value ? 0 : cachedMaxScroll
    const distancePx = Math.abs(targetY - startY)
    if (distancePx < 8) return

    const durationSec = Math.max(
      SCROLL_PACE_CONFIG.minDurationSec,
      Math.min(
        SCROLL_PACE_CONFIG.maxDurationSec,
        distancePx / SCROLL_PACE_CONFIG.pixelsPerSecond
      )
    )

    if (lenisState.value) {
      lenisState.value.scrollTo(targetY, {
        duration: durationSec,
        easing: easeInOutSilk,
        lock: false
      })
      return
    }

    // Interruptible rAF fallback (guarantees identical distance pacing on mobile/touch)
    const durationMs = durationSec * 1000
    const startTime = performance.now()

    window.addEventListener('wheel', cancelFallbackGlide, { passive: true, once: true })
    window.addEventListener('touchstart', cancelFallbackGlide, { passive: true, once: true })
    window.addEventListener('keydown', cancelFallbackGlide, { passive: true, once: true })

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs)
      const eased = easeInOutSilk(t)
      window.scrollTo(0, startY + (targetY - startY) * eased)
      if (t < 1) {
        fallbackScrollRafId = requestAnimationFrame(step)
      } else {
        cancelFallbackGlide()
      }
    }

    fallbackScrollRafId = requestAnimationFrame(step)
  }

  watch(
    () => route.path,
    () => {
      dockRouteOverride.value = null
    },
    { flush: 'sync' }
  )

  watch(
    () => route.fullPath,
    () => {
      nextTick(() => {
        rebuildLayoutCache()
        if (settleTimerId) clearTimeout(settleTimerId)
        settleTimerId = setTimeout(rebuildLayoutCache, 450)
      })
    }
  )

  onMounted(() => {
    activeConsumers += 1
    if (activeConsumers === 1) {
      rebuildLayoutCache()
      window.addEventListener('scroll', onPassiveScroll, { passive: true })
      window.addEventListener('resize', rebuildLayoutCache, { passive: true })

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          rebuildLayoutCache()
        })
        resizeObserver.observe(document.documentElement)
      }
    } else {
      syncScrollFrame()
    }
  })

  onBeforeUnmount(() => {
    activeConsumers = Math.max(0, activeConsumers - 1)
    if (activeConsumers === 0) {
      cancelFallbackGlide()
      if (settleTimerId) clearTimeout(settleTimerId)
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
      if (import.meta.client) {
        window.removeEventListener('scroll', onPassiveScroll)
        window.removeEventListener('resize', rebuildLayoutCache)
      }
    }
  })

  return {
    isScrollable,
    isAtBottom,
    scrollNavTheme,
    actionDockTheme,
    dockRouteOverride,
    isScrollNavAllowed,
    isActionDockAllowed,
    setPageFloatingOverrides,
    scrollToBoundaryByPace,
    rebuildLayoutCache
  }
}