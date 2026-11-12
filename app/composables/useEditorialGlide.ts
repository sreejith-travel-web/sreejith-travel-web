// ~/app/composables/useEditorialGlide.ts
import { useState } from '#imports'
import type Lenis from 'lenis'

// ============================================================================
// TUNABLE GLIDE & PHYSICS CONSTANTS (Edit these values to speed up / slow down)
// ============================================================================
export const EDITORIAL_GLIDE_CONFIG = {
  /** Horizontal tab centering duration when clicking or arrow-keying a tab (ms) */
  TAB_SELECT_GLIDE_MS: 740,
  /** Horizontal gentle edge-settle duration after touch swipe or mouse drag (ms) */
  TAB_SETTLE_SNAP_MS: 560,
  /** Horizontal step duration when clicking desktop left/right chevron pills (ms) */
  TAB_ARROW_STEP_MS: 820,
  /** Idle pause after native touch momentum before checking clipped edge tabs (ms) */
  SETTLE_IDLE_DELAY_MS: 180,
  /** Vertical page scroll glide duration when switching tabs or filter anchors (ms) */
  PAGE_VERTICAL_GLIDE_MS: 920,
  /** Mouse grab-and-drag inertia decay per 60fps frame (0.90 = short, 0.96 = long coast) */
  DRAG_INERTIA_FRICTION: 0.920
} as const

/**
 * Asymmetric Silk S-Curve:
 * Smoothly lifts off from 0 velocity (no frame-1 snap) and spends the second half
 * feathering softly into the final pixel position.
 */
export const easeSilkGlide = (t: number): number => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return 0.5 - 0.5 * Math.cos(Math.PI * Math.pow(t, 0.85))
}

let activeVerticalRaf: number | null = null
let cleanupInterruptListeners: (() => void) | null = null

const stopVerticalFallbackRaf = () => {
  if (activeVerticalRaf !== null) {
    cancelAnimationFrame(activeVerticalRaf)
    activeVerticalRaf = null
  }
  if (cleanupInterruptListeners) {
    cleanupInterruptListeners()
    cleanupInterruptListeners = null
  }
}

export function useEditorialGlide() {
  const lenisInstance = useState<Lenis | null>('lenis-instance', () => null)

  /**
   * Smoothly glides vertical window scroll to `rawTargetY` over `durationMs`.
   * Uses Lenis natively when mounted, with a passive-interruptible rAF fallback.
   */
  const glidePageScrollTo = (
    rawTargetY: number,
    durationMs: number = EDITORIAL_GLIDE_CONFIG.PAGE_VERTICAL_GLIDE_MS
  ) => {
    if (!import.meta.client) return

    stopVerticalFallbackRaf()

    const maxDocScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    )
    const targetY = Math.max(0, Math.min(maxDocScroll, Math.round(rawTargetY)))
    const startY = window.scrollY || 0
    const delta = targetY - startY

    if (Math.abs(delta) < 3) return

    const lenis = lenisInstance.value
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(targetY, {
        duration: durationMs / 1000,
        easing: easeSilkGlide,
        lock: false,
        force: true
      })
      return
    }

    // Fallback rAF glide (cancels immediately if user manually wheels or touches)
    const onUserInterrupt = () => stopVerticalFallbackRaf()
    window.addEventListener('wheel', onUserInterrupt, { passive: true, once: true })
    window.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true })
    cleanupInterruptListeners = () => {
      window.removeEventListener('wheel', onUserInterrupt)
      window.removeEventListener('touchstart', onUserInterrupt)
    }

    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs)
      const currentY = startY + delta * easeSilkGlide(progress)
      window.scrollTo(0, currentY)

      if (progress < 1) {
        activeVerticalRaf = requestAnimationFrame(step)
      } else {
        window.scrollTo(0, targetY)
        stopVerticalFallbackRaf()
      }
    }

    activeVerticalRaf = requestAnimationFrame(step)
  }

  // Zero-CLS height preservation hooks for <Transition mode="out-in">
  let lockedContainerEl: HTMLElement | null = null

  const lockPanelHeightBeforeLeave = (el: Element) => {
    if (!import.meta.client || !(el instanceof HTMLElement)) return
    const parent = el.parentElement
    if (!parent) return
    lockedContainerEl = parent
    parent.style.minHeight = `${el.offsetHeight}px`
  }

  const releasePanelHeightAfterEnter = () => {
    if (lockedContainerEl) {
      lockedContainerEl.style.minHeight = ''
      lockedContainerEl = null
    }
  }

  return {
    EDITORIAL_GLIDE_CONFIG,
    easeSilkGlide,
    glidePageScrollTo,
    lockPanelHeightBeforeLeave,
    releasePanelHeightAfterEnter
  }
}