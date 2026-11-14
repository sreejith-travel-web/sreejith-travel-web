<!-- ~/app/components/FloatingActionDock.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { useRoute } from '#imports'
import { useFloatingControls } from '~/composables/useFloatingControls'

const DOCK_FLOW = {
  // Glides in 160ms after ScrollNav (1500ms) for an organic overlapping rise
  entranceDelayMs: 1660,
  // Liquid pill glides open smoothly while entrance settles
  autoGlideOpenOffsetMs: 420,
  // Holds gently so user registers CHAT / PLAN / ASK, then glides shut
  autoDiscoveryHoldMs: 2100,
  hoverGraceHoldMs: 650,
  replayOnRouteChange: true,
  whatsappHref: 'https://wa.me/919943360478',
  planRoute: '/planyourjourney',
  askFallbackRoute: '/contact'
} as const

const emit = defineEmits<{
  (e: 'open-consult'): void
}>()

const route = useRoute()
const {
  isScrollable,
  actionDockTheme,
  isScrollNavAllowed,
  isActionDockAllowed
} = useFloatingControls()

const dockRootRef = ref<HTMLElement | null>(null)
const isEntered = ref(false)
const isOpen = ref(false)
const isPointerInside = ref(false)
const isAutoPeeking = ref(false)

let entranceTimerId: ReturnType<typeof setTimeout> | null = null
let autoOpenTimerId: ReturnType<typeof setTimeout> | null = null
let autoCloseTimerId: ReturnType<typeof setTimeout> | null = null

const normalizePath = (p: string): string =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p

const showPlanItem = computed<boolean>(() => {
  const cleanPath = normalizePath(route.path).toLowerCase()
  return cleanPath !== DOCK_FLOW.planRoute && cleanPath !== '/plan-your-journey'
})

const clearTimers = () => {
  if (entranceTimerId) clearTimeout(entranceTimerId)
  if (autoOpenTimerId) clearTimeout(autoOpenTimerId)
  if (autoCloseTimerId) clearTimeout(autoCloseTimerId)
  entranceTimerId = null
  autoOpenTimerId = null
  autoCloseTimerId = null
}

const collapseAutoDiscovery = () => {
  if (!isAutoPeeking.value || isPointerInside.value) return
  isOpen.value = false
  isAutoPeeking.value = false
}

const runSilkEntranceSequence = () => {
  clearTimers()
  isEntered.value = false
  isOpen.value = false
  isAutoPeeking.value = false

  if (!isActionDockAllowed.value) return

  entranceTimerId = setTimeout(() => {
    isEntered.value = true

    autoOpenTimerId = setTimeout(() => {
      isOpen.value = true
      isAutoPeeking.value = true

      autoCloseTimerId = setTimeout(() => {
        collapseAutoDiscovery()
      }, DOCK_FLOW.autoDiscoveryHoldMs)
    }, DOCK_FLOW.autoGlideOpenOffsetMs)
  }, DOCK_FLOW.entranceDelayMs)
}

const toggleMenu = () => {
  if (autoOpenTimerId) clearTimeout(autoOpenTimerId)
  if (autoCloseTimerId) clearTimeout(autoCloseTimerId)
  isAutoPeeking.value = false
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  if (!isOpen.value) return
  if (autoCloseTimerId) clearTimeout(autoCloseTimerId)
  isAutoPeeking.value = false
  isOpen.value = false
}

const onDockMouseEnter = () => {
  isPointerInside.value = true
  if (isAutoPeeking.value && autoCloseTimerId) {
    clearTimeout(autoCloseTimerId)
    autoCloseTimerId = null
  }
}

const onDockMouseLeave = () => {
  isPointerInside.value = false
  if (isAutoPeeking.value && isOpen.value) {
    if (autoCloseTimerId) clearTimeout(autoCloseTimerId)
    autoCloseTimerId = setTimeout(() => {
      collapseAutoDiscovery()
    }, DOCK_FLOW.hoverGraceHoldMs)
  }
}

const handleActionSelect = (kind: 'chat' | 'plan' | 'ask') => {
  if (kind === 'ask') {
    emit('open-consult')
  }
  closeMenu()
}

const onDocumentPointerDown = (e: PointerEvent) => {
  if (!isOpen.value) return
  const rootEl = dockRootRef.value
  if (rootEl && !rootEl.contains(e.target as Node)) {
    isAutoPeeking.value = false
    isOpen.value = false
  }
}

const onWindowKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    closeMenu()
  }
}

// Continuous reversible CSS transition (bottom-to-top glide on open, top-to-bottom on close)
const itemGlideStyle = (bottomUpIdx: number, topDownIdx: number): Record<string, string> => {
  const delayMs = isOpen.value ? 65 + bottomUpIdx * 75 : topDownIdx * 45
  const durationMs = isOpen.value ? 540 : 340
  return {
    opacity: isOpen.value ? '1' : '0',
    transform: isOpen.value
      ? 'translate3d(0, 0, 0) scale(1)'
      : 'translate3d(0, 12px, 0) scale(0.88)',
    transitionProperty: 'opacity, transform',
    transitionDuration: `${durationMs}ms`,
    transitionDelay: `${delayMs}ms`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
  }
}

watch(
  () => route.path,
  () => {
    closeMenu()
    if (DOCK_FLOW.replayOnRouteChange) {
      runSilkEntranceSequence()
    }
  }
)

watch(isActionDockAllowed, (allowed) => {
  if (!allowed) {
    clearTimers()
    isEntered.value = false
    isOpen.value = false
    isAutoPeeking.value = false
  } else if (!isEntered.value && !entranceTimerId) {
    runSilkEntranceSequence()
  }
})

onMounted(() => {
  runSilkEntranceSequence()

  document.addEventListener('pointerdown', onDocumentPointerDown)
  window.addEventListener('keydown', onWindowKeydown)
})

onBeforeUnmount(() => {
  clearTimers()
  if (import.meta.client) {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    window.removeEventListener('keydown', onWindowKeydown)
  }
})
</script>

<template>
  <div
    v-if="isActionDockAllowed"
    ref="dockRootRef"
    class="action-dock-anchor"
    :class="[
      isEntered
        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        : 'opacity-0 translate-y-4 scale-88 pointer-events-none',
      {
        'is-solo-no-scrollnav': !isScrollNavAllowed,
        'is-unscrollable-page': isScrollNavAllowed && !isScrollable
      }
    ]"
    @mouseenter="onDockMouseEnter"
    @mouseleave="onDockMouseLeave"
  >
    <!-- UNIFIED LIQUID STADIUM PILL (Glides Smoothly Between ••• Sphere & Full Capsule) -->
    <div
      id="floating-quick-capsule"
      :data-open="isOpen ? 'true' : 'false'"
      :data-surface-theme="actionDockTheme"
      class="action-dock-pill"
    >
      <!-- Upper Action Items Stack (CHAT • PLAN • ASK) -->
      <div
        :aria-hidden="!isOpen || undefined"
        :inert="!isOpen || undefined"
        class="action-dock-items-stack"
        :class="isOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      >
        <!-- Top Item: WhatsApp Chat -->
        <a
          :href="DOCK_FLOW.whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          class="action-dock-item"
          :style="itemGlideStyle(showPlanItem ? 2 : 1, 0)"
          @click="handleActionSelect('chat')"
        >
          <span class="action-dock-badge-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-4.5 h-4.5 md:w-5 md:h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
          <span class="action-dock-label">Chat</span>
        </a>

        <!-- Middle Item: Plan Your Journey (Folded Map Icon) -->
        <NuxtLink
          v-if="showPlanItem"
          :to="DOCK_FLOW.planRoute"
          aria-label="Plan Your Journey"
          class="action-dock-item"
          :style="itemGlideStyle(1, 1)"
          @click="handleActionSelect('plan')"
        >
          <span class="action-dock-badge-neutral">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.65"
              stroke="currentColor"
              aria-hidden="true"
              class="w-4.5 h-4.5 md:w-5 md:h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
          </span>
          <span class="action-dock-label">Plan</span>
        </NuxtLink>

        <!-- Bottom Action Item: Ask / Consult -->
        <NuxtLink
          :to="DOCK_FLOW.askFallbackRoute"
          aria-label="Ask or Consult With Me"
          class="action-dock-item"
          :style="itemGlideStyle(0, showPlanItem ? 2 : 1)"
          @click="handleActionSelect('ask')"
        >
          <span class="action-dock-badge-neutral">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.65"
              stroke="currentColor"
              aria-hidden="true"
              class="w-4.5 h-4.5 md:w-5 md:h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </span>
          <span class="action-dock-label">Ask</span>
        </NuxtLink>
      </div>

      <!-- Bottom Base Cap: ••• When Collapsed <-> Ringed × Badge Inside Pill When Open -->
      <button
        type="button"
        :aria-expanded="isOpen"
        aria-controls="floating-quick-capsule"
        :aria-label="isOpen ? 'Close quick actions' : 'Open quick actions: Chat, Plan, Ask'"
        class="group action-dock-cap-btn"
        @click="toggleMenu"
      >
        <!-- Collapsed 3-Dot Icon (Larger Dots & Wider Spacing) -->
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="pointer-events-none relative z-10 col-start-1 row-start-1 w-6 h-6 md:w-6.5 md:h-6.5 transition-all duration-450 ease-editorial"
          :class="
            isOpen
              ? 'opacity-0 rotate-45 scale-60'
              : 'opacity-100 rotate-0 scale-100 group-hover:scale-108'
          "
        >
          <circle cx="4.75" cy="12" r="2.05" />
          <circle cx="12" cy="12" r="2.05" />
          <circle cx="19.25" cy="12" r="2.05" />
        </svg>

        <!-- Expanded Inner Circular Close Badge -->
        <span
          aria-hidden="true"
          class="pointer-events-none action-dock-close-inner"
          :class="
            isOpen
              ? 'opacity-100 -translate-y-0.5 rotate-0 scale-100 group-hover:scale-106'
              : 'opacity-0 translate-y-0 -rotate-45 scale-65'
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.15"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4.5 h-4.5"
          >
            <path d="M17 7L7 17M7 7l10 10" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-dock-anchor {
  --dock-edge-gap: 0.75rem;
  --dock-bottom: calc(0.875rem + env(safe-area-inset-bottom, 0px));
  --dock-btn-size: 2.625rem;
  --dock-pill-width: 3.0625rem;
  --dock-stack-gap: 0.625rem;
  --dock-clip-x: calc((var(--dock-pill-width) - var(--dock-btn-size)) * 0.5);
  --dock-right: calc(var(--dock-edge-gap) - var(--dock-clip-x) + env(safe-area-inset-right, 0px));

  position: fixed;
  z-index: 90;
  right: var(--dock-right);
  bottom: calc(var(--dock-bottom) + var(--dock-btn-size) + var(--dock-stack-gap));
  width: var(--dock-pill-width);
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
  align-items: end;
  justify-items: center;
  will-change: transform;
  filter: drop-shadow(0 10px 18px rgba(4, 24, 46, 0.34));
  transition:
    opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
    translate 720ms cubic-bezier(0.16, 1, 0.3, 1),
    scale 720ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
    bottom 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (min-width: 481px) {
  .action-dock-anchor {
    --dock-edge-gap: 0.875rem;
  }
}

@media (min-width: 640px) {
  .action-dock-anchor {
    --dock-edge-gap: 1.25rem;
    --dock-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
    --dock-btn-size: 2.75rem;
    --dock-pill-width: 3.25rem;
    --dock-stack-gap: 0.6875rem;
  }
}

@media (min-width: 768px) {
  .action-dock-anchor {
    --dock-edge-gap: 1.5rem;
    --dock-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
    --dock-btn-size: 2.875rem;
    --dock-pill-width: 3.375rem;
    --dock-stack-gap: 0.75rem;
  }
}

/* Short pages where ScrollNav hides (no mobile bottom bar present) */
.action-dock-anchor.is-unscrollable-page {
  bottom: var(--dock-bottom);
}

/* Views without ScrollNav (Journal Article):
   - < 1024px: stays safely elevated above the fixed mobile bottom bar
   - >= 1024px: drops directly into ScrollNav's bottom-corner slot */
@media (max-width: 639.98px) {
  .action-dock-anchor.is-solo-no-scrollnav {
    bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
  }
}

@media (min-width: 1024px) {
  .action-dock-anchor.is-solo-no-scrollnav {
    bottom: var(--dock-bottom);
  }
}

.action-dock-pill {
  position: relative;
  isolation: isolate;
  grid-column-start: 1;
  grid-row-start: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
  user-select: none;
  will-change: clip-path;
  transition:
    clip-path 620ms cubic-bezier(0.22, 1, 0.36, 1),
    color 420ms ease,
    border-color 360ms ease;
}

.action-dock-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.action-dock-pill[data-surface-theme='light'] {
  color: var(--color-primary-dark);
  border: 1px solid rgba(168, 211, 226, 0.32);
  background-color: var(--color-intention-blue);
  background-image:
    radial-gradient(125% 52% at 26% 16%, rgba(57, 127, 157, 0.74) 0%, rgba(4, 62, 110, 0.24) 58%, transparent 82%),
    radial-gradient(120% 46% at 28% 62%, rgba(57, 127, 157, 0.5) 0%, transparent 76%),
    linear-gradient(165deg, #084c84 0%, #053662 52%, #032142 100%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.28);
}

.action-dock-pill[data-surface-theme='light']::before {
  background-image:
    radial-gradient(95% 75% at 32% 20%, rgba(121, 185, 210, 0.6) 0%, transparent 70%),
    linear-gradient(180deg, var(--color-action-blue) 0%, #063d6d 56%, #04284c 100%);
}

.action-dock-pill[data-surface-theme='light'][data-open='true']:hover {
  border-color: rgba(168, 211, 226, 0.5);
}

.action-dock-pill[data-surface-theme='dark'] {
  color: var(--color-journey-deep);
  border: 1px solid rgba(255, 253, 248, 0.88);
  background-color: #f6ead6;
  background-image:
    radial-gradient(130% 52% at 26% 15%, #ffffff 0%, rgba(255, 255, 255, 0.72) 44%, transparent 78%),
    radial-gradient(125% 46% at 28% 64%, rgba(255, 255, 255, 0.8) 0%, transparent 74%),
    linear-gradient(165deg, #ffffff 0%, #f9efe0 52%, #e6d0ae 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.94);
}

.action-dock-pill[data-surface-theme='dark']::before {
  background-image:
    radial-gradient(95% 75% at 30% 18%, #ffffff 0%, transparent 70%),
    linear-gradient(180deg, #fff8eb 0%, #f9e6c4 54%, #e5c799 100%);
}

.action-dock-pill[data-surface-theme='dark'][data-open='true']:hover {
  border-color: rgba(255, 193, 92, 0.9);
}

.action-dock-pill[data-open='false'] {
  clip-path: inset(
    calc(100% - var(--dock-btn-size)) var(--dock-clip-x) 0px var(--dock-clip-x) round 999px
  );
  border-color: transparent;
}

.action-dock-pill[data-open='true'] {
  clip-path: inset(calc(0% + 0px) 0px 0px 0px round 999px);
}

.action-dock-pill[data-open='true']:hover::before {
  opacity: 0.54;
}

.action-dock-items-stack {
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding-bottom: 0.5rem;
}

.action-dock-items-stack :deep(.action-dock-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
  text-decoration: none;
  outline: none;
  border-radius: 1rem;
  cursor: pointer;
  user-select: none;
  will-change: transform;
}

.action-dock-items-stack :deep(.action-dock-item:focus-visible) {
  outline: 2px solid var(--color-dark-gold);
  outline-offset: 2px;
}

.action-dock-badge-whatsapp,
.action-dock-badge-neutral {
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 9999px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
  place-items: center;
}

@media (min-width: 768px) {
  .action-dock-badge-whatsapp,
  .action-dock-badge-neutral {
    width: 2.375rem;
    height: 2.375rem;
  }
}

.action-dock-badge-whatsapp {
  color: #ffffff;
  background-image: radial-gradient(
    110% 110% at 30% 22%,
    #4ce884 0%,
    var(--color-whatsapp) 56%,
    #169d48 100%
  );
  border: 1.25px solid rgba(255, 255, 255, 0.42);
  box-shadow:
    0 6px 13px -3px rgba(16, 118, 54, 0.5),
    0 2px 4px rgba(2, 18, 36, 0.22);
  transition: transform 350ms var(--ease-editorial);
}

.action-dock-badge-neutral {
  color: var(--color-journey-deep);
  transition:
    transform 350ms var(--ease-editorial),
    color 350ms var(--ease-editorial),
    border-color 350ms var(--ease-editorial);
}

.action-dock-pill[data-surface-theme='light'] .action-dock-badge-neutral {
  background-image: radial-gradient(115% 115% at 30% 22%, #ffffff 0%, #f8f3ea 64%, #eae0ce 100%);
  border: 1.25px solid rgba(255, 193, 92, 0.46);
  box-shadow:
    0 6px 14px -2px rgba(2, 12, 28, 0.54),
    0 2px 5px rgba(2, 12, 28, 0.34),
    inset 0 1px 1px #ffffff;
}

.action-dock-pill[data-surface-theme='dark'] .action-dock-badge-neutral {
  background-image: radial-gradient(115% 115% at 30% 22%, #ffffff 0%, #ffffff 62%, #edf2f7 100%);
  border: 1.25px solid rgba(4, 62, 110, 0.24);
  box-shadow:
    0 6px 13px -2px rgba(5, 27, 59, 0.25),
    0 2px 5px -1px rgba(5, 27, 59, 0.17),
    inset 0 1px 0 #ffffff;
}

.action-dock-items-stack :deep(.action-dock-item:hover .action-dock-badge-whatsapp),
.action-dock-items-stack :deep(.action-dock-item:active .action-dock-badge-whatsapp) {
  transform: scale(1.07);
}

.action-dock-items-stack :deep(.action-dock-item:hover .action-dock-badge-neutral),
.action-dock-items-stack :deep(.action-dock-item:active .action-dock-badge-neutral) {
  color: var(--color-action-blue);
  border-color: rgba(212, 131, 2, 0.62);
  transform: scale(1.07);
}

.action-dock-label {
  font-family: var(--font-uppercase);
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  line-height: 1;
  transition: color 400ms ease;
}

@media (min-width: 768px) {
  .action-dock-label {
    font-size: 9px;
  }
}

.action-dock-pill[data-surface-theme='light'] .action-dock-label {
  color: rgba(248, 250, 252, 0.94);
}

.action-dock-pill[data-surface-theme='dark'] .action-dock-label {
  color: var(--color-journey-deep);
}

/* Bottom Cap Button: Carries Exact 1:1 ScrollNav Spherical Skin When Collapsed */
.action-dock-cap-btn {
  position: relative;
  isolation: isolate;
  margin-inline: auto;
  width: var(--dock-btn-size);
  height: var(--dock-btn-size);
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
  place-items: center;
  border-radius: 9999px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  outline: none;
}

.action-dock-cap-btn:focus-visible {
  outline: 2px solid var(--color-dark-gold);
  outline-offset: -2px;
}

.action-dock-cap-btn::before,
.action-dock-cap-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  transition:
    opacity 360ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 360ms ease;
}

.action-dock-cap-btn::before {
  z-index: 0;
  opacity: 0;
}

.action-dock-cap-btn::after {
  z-index: 1;
  opacity: 0;
}

.action-dock-pill[data-open='false'] .action-dock-cap-btn::before {
  opacity: 1;
}

.action-dock-pill[data-open='false']:hover .action-dock-cap-btn::after {
  opacity: 1;
}

.action-dock-pill[data-surface-theme='light'] .action-dock-cap-btn::before {
  border: 1px solid rgba(168, 211, 226, 0.32);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.28);
  background-color: var(--color-intention-blue);
  background-image:
    radial-gradient(88% 88% at 32% 22%, rgba(57, 127, 157, 0.72) 0%, rgba(4, 62, 110, 0.24) 56%, transparent 82%),
    radial-gradient(120% 120% at 50% 55%, #064478 0%, #032142 100%);
}

.action-dock-pill[data-surface-theme='light'] .action-dock-cap-btn::after {
  border: 1px solid rgba(168, 211, 226, 0.54);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.32);
  background-image:
    radial-gradient(92% 92% at 32% 22%, rgba(121, 185, 210, 0.64) 0%, transparent 72%),
    radial-gradient(120% 120% at 50% 55%, var(--color-action-blue) 0%, #053561 100%);
}

.action-dock-pill[data-surface-theme='dark'] .action-dock-cap-btn::before {
  border: 1px solid rgba(255, 253, 248, 0.88);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.92);
  background-color: #f6ead6;
  background-image: radial-gradient(
    95% 95% at 30% 20%,
    #ffffff 0%,
    #f9efe0 54%,
    #ead7b8 100%
  );
}

.action-dock-pill[data-surface-theme='dark'] .action-dock-cap-btn::after {
  border: 1px solid rgba(255, 193, 92, 0.9);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95);
  background-image: radial-gradient(
    95% 95% at 30% 20%,
    #ffffff 0%,
    #fdefd4 52%,
    #e5c89a 100%
  );
}

.action-dock-close-inner {
  position: relative;
  z-index: 10;
  grid-column-start: 1;
  grid-row-start: 1;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  color: var(--color-primary-dark);
  transition: all 500ms var(--ease-editorial);
}

@media (min-width: 768px) {
  .action-dock-close-inner {
    width: 2.375rem;
    height: 2.375rem;
  }
}

.action-dock-pill[data-surface-theme='light'] .action-dock-close-inner {
  background-image: radial-gradient(115% 115% at 32% 22%, #094578 0%, #032142 100%);
  border: 1.25px solid rgba(255, 193, 92, 0.62);
}

.action-dock-pill[data-surface-theme='dark'] .action-dock-close-inner {
  background-image: radial-gradient(115% 115% at 32% 22%, #0d4d84 0%, #032352 100%);
  border: 1px solid rgba(5, 27, 59, 0.25);
  box-shadow: 0 5px 12px -3px rgba(3, 35, 82, 0.42);
}
</style>