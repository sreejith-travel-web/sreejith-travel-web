<!-- ~/app/components/ScrollNav.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from '#imports'
import { useFloatingControls } from '~/composables/useFloatingControls'

const SCROLL_NAV_INTRO = {
  entranceDelayMs: 1500,
  replayOnRouteChange: true
} as const

const route = useRoute()
const {
  isScrollable,
  isAtBottom,
  scrollNavTheme,
  isScrollNavAllowed,
  scrollToBoundaryByPace
} = useFloatingControls()

const isEntered = ref(false)
let entranceTimerId: ReturnType<typeof setTimeout> | null = null

const clearEntranceTimer = () => {
  if (entranceTimerId) {
    clearTimeout(entranceTimerId)
    entranceTimerId = null
  }
}

const scheduleEntrance = () => {
  clearEntranceTimer()
  isEntered.value = false

  if (!isScrollNavAllowed.value) return

  entranceTimerId = setTimeout(() => {
    isEntered.value = true
  }, SCROLL_NAV_INTRO.entranceDelayMs)
}

watch(
  () => route.path,
  () => {
    if (SCROLL_NAV_INTRO.replayOnRouteChange) {
      scheduleEntrance()
    }
  }
)

watch(isScrollNavAllowed, (allowed) => {
  if (!allowed) {
    clearEntranceTimer()
    isEntered.value = false
  } else if (!isEntered.value && !entranceTimerId) {
    scheduleEntrance()
  }
})

onMounted(() => {
  scheduleEntrance()
})

onBeforeUnmount(() => {
  clearEntranceTimer()
})
</script>

<template>
  <div
    v-if="isScrollNavAllowed"
    class="scroll-nav-anchor"
    :class="
      isEntered && isScrollable
        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        : 'opacity-0 translate-y-4 scale-88 pointer-events-none'
    "
  >
    <button
      type="button"
      :data-surface-theme="scrollNavTheme"
      :aria-label="isAtBottom ? 'Scroll back to top' : 'Scroll to bottom'"
      class="group scroll-nav-sphere"
      @click="scrollToBoundaryByPace"
    >
      <!-- Downward Chevron (Bolder Stroke & Wider Span) -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.35"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="pointer-events-none relative z-10 col-start-1 row-start-1 w-5.5 h-5.5 md:w-6 md:h-6 transition-all duration-400 ease-editorial"
        :class="
          isAtBottom
            ? 'opacity-0 translate-y-2.5 scale-70'
            : 'opacity-100 translate-y-0 scale-100 group-hover:translate-y-1 group-active:translate-y-1'
        "
      >
        <path d="M5.25 9.25 12 16l6.75-6.75" />
      </svg>

      <!-- Upward Chevron (Bolder Stroke & Wider Span) -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.35"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="pointer-events-none relative z-10 col-start-1 row-start-1 w-5.5 h-5.5 md:w-6 md:h-6 transition-all duration-400 ease-editorial"
        :class="
          isAtBottom
            ? 'opacity-100 translate-y-0 scale-100 group-hover:-translate-y-1 group-active:-translate-y-1'
            : 'opacity-0 -translate-y-2.5 scale-70'
        "
      >
        <path d="M18.75 14.75 12 8l-6.75 6.75" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.scroll-nav-anchor {
  --dock-edge-gap: 0.75rem;
  --dock-bottom: calc(0.875rem + env(safe-area-inset-bottom, 0px));
  --dock-btn-size: 2.625rem;
  --dock-pill-width: 3.0625rem;
  --dock-clip-x: calc((var(--dock-pill-width) - var(--dock-btn-size)) * 0.5);
  --dock-right: calc(var(--dock-edge-gap) - var(--dock-clip-x) + env(safe-area-inset-right, 0px));

  position: fixed;
  z-index: 90;
  right: var(--dock-right);
  bottom: var(--dock-bottom);
  width: var(--dock-pill-width);
  height: var(--dock-btn-size);
  display: grid;
  place-items: center;
  will-change: transform;
  transition:
    opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
    translate 720ms cubic-bezier(0.16, 1, 0.3, 1),
    scale 720ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 481px) {
  .scroll-nav-anchor {
    --dock-edge-gap: 0.875rem;
  }
}

@media (min-width: 640px) {
  .scroll-nav-anchor {
    --dock-edge-gap: 1.25rem;
    --dock-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
    --dock-btn-size: 2.75rem;
    --dock-pill-width: 3.25rem;
  }
}

@media (min-width: 768px) {
  .scroll-nav-anchor {
    --dock-edge-gap: 1.5rem;
    --dock-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
    --dock-btn-size: 2.875rem;
    --dock-pill-width: 3.375rem;
  }
}

.scroll-nav-sphere {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
  place-items: center;
  width: var(--dock-btn-size);
  height: var(--dock-btn-size);
  border-radius: 9999px;
  cursor: pointer;
  user-select: none;
  outline: none;
  overflow: hidden;
  box-shadow:
    0 10px 22px -6px rgba(4, 24, 46, 0.38),
    inset 0 1px 1px rgba(255, 255, 255, 0.28);
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    scale 360ms cubic-bezier(0.22, 1, 0.36, 1),
    color 420ms ease,
    border-color 360ms ease,
    box-shadow 420ms ease;
}

.scroll-nav-sphere:active {
  scale: 0.94;
}

.scroll-nav-sphere:focus-visible {
  outline: 2px solid var(--color-dark-gold);
  outline-offset: 2px;
}

.scroll-nav-sphere::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.scroll-nav-sphere[data-surface-theme='light'] {
  color: var(--color-primary-dark);
  border: 1px solid rgba(168, 211, 226, 0.32);
  background-color: var(--color-intention-blue);
  background-image:
    radial-gradient(88% 88% at 32% 22%, rgba(57, 127, 157, 0.72) 0%, rgba(4, 62, 110, 0.24) 56%, transparent 82%),
    radial-gradient(120% 120% at 50% 55%, #064478 0%, #032142 100%);
}

.scroll-nav-sphere[data-surface-theme='light']::before {
  background-image:
    radial-gradient(92% 92% at 32% 22%, rgba(121, 185, 210, 0.64) 0%, transparent 72%),
    radial-gradient(120% 120% at 50% 55%, var(--color-action-blue) 0%, #053561 100%);
}

.scroll-nav-sphere[data-surface-theme='light']:hover {
  border-color: rgba(168, 211, 226, 0.54);
}

.scroll-nav-sphere[data-surface-theme='dark'] {
  color: var(--color-journey-deep);
  border: 1px solid rgba(255, 253, 248, 0.88);
  background-color: #f6ead6;
  background-image: radial-gradient(
    95% 95% at 30% 20%,
    #ffffff 0%,
    #f9efe0 54%,
    #ead7b8 100%
  );
  box-shadow:
    0 12px 26px -6px rgba(2, 12, 26, 0.55),
    inset 0 1px 1px rgba(255, 255, 255, 0.92);
}

.scroll-nav-sphere[data-surface-theme='dark']::before {
  background-image: radial-gradient(
    95% 95% at 30% 20%,
    #ffffff 0%,
    #fdefd4 52%,
    #e5c89a 100%
  );
}

.scroll-nav-sphere[data-surface-theme='dark']:hover {
  border-color: rgba(255, 193, 92, 0.9);
}

.scroll-nav-sphere:hover::before {
  opacity: 1;
}
</style>