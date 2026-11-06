<!-- ~/app/components/itineraries/ItineraryScrollNav.vue -->
<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface ScrollNavSection {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    sections: ScrollNavSection[]
    scrollOffset?: number
  }>(),
  {
    scrollOffset: 144
  }
)

const activeId = ref<string>(props.sections[0]?.id || '')
const navTrackRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Record<string, HTMLButtonElement | null>>({})

// Smooth sliding underline geometry
const indicator = reactive({
  left: 0,
  width: 0,
  ready: false
})

let isProgrammaticScroll = false
let scrollUnlockTimer: ReturnType<typeof setTimeout> | null = null
let spyRafId: number | null = null
let inertiaRafId: number | null = null

const setTabRef = (id: string, el: unknown) => {
  tabRefs.value[id] = el as HTMLButtonElement | null
}

const updateIndicatorGeometry = () => {
  const btn = tabRefs.value[activeId.value]
  if (!btn) return
  indicator.left = btn.offsetLeft
  indicator.width = btn.offsetWidth
  indicator.ready = true
}

const centerActiveTabInTrack = (id: string) => {
  const track = navTrackRef.value
  const btn = tabRefs.value[id]
  if (!track || !btn) return

  const targetLeft = btn.offsetLeft - track.clientWidth / 2 + btn.clientWidth / 2
  track.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: 'smooth'
  })
}

const scrollToSection = (id: string) => {
  if (!import.meta.client) return
  const target = document.getElementById(id)
  if (!target) return

  isProgrammaticScroll = true
  activeId.value = id
  updateIndicatorGeometry()
  centerActiveTabInTrack(id)

  if (scrollUnlockTimer) clearTimeout(scrollUnlockTimer)

  const y = target.getBoundingClientRect().top + window.scrollY - props.scrollOffset
  window.scrollTo({
    top: Math.max(0, y),
    behavior: 'smooth'
  })

  scrollUnlockTimer = setTimeout(() => {
    isProgrammaticScroll = false
    evaluateActiveSection()
  }, 700)
}

// --- Deterministic Monotonic Scroll-Spy (Never bounces back and forth) ---
const evaluateActiveSection = () => {
  spyRafId = null
  if (!import.meta.client || isProgrammaticScroll || !props.sections.length) return

  const triggerLine = props.scrollOffset + 28
  let candidateId = props.sections[0]?.id || ''

  for (const sec of props.sections) {
    const el = document.getElementById(sec.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= triggerLine) {
      candidateId = sec.id
    } else {
      break
    }
  }

  // If scrolled to the very bottom of the document, activate the last visible section
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40
  if (scrolledToBottom && props.sections.length > 0) {
    const lastSec = props.sections[props.sections.length - 1]
    if (lastSec) candidateId = lastSec.id
  }

  if (candidateId && activeId.value !== candidateId) {
    activeId.value = candidateId
    updateIndicatorGeometry()
    centerActiveTabInTrack(candidateId)
  }
}

const onWindowScroll = () => {
  if (spyRafId !== null) return
  spyRafId = requestAnimationFrame(evaluateActiveSection)
}

const onWindowResize = () => {
  updateIndicatorGeometry()
  evaluateActiveSection()
}

// --- Press & Hold Drag + Swipe + Inertia Physics ---
const isDragging = ref(false)
let startX = 0
let startScrollLeft = 0
let lastX = 0
let lastTime = 0
let velocityX = 0
let maxDragDistance = 0

const stopInertia = () => {
  if (inertiaRafId !== null) {
    cancelAnimationFrame(inertiaRafId)
    inertiaRafId = null
  }
}

const startInertia = () => {
  const track = navTrackRef.value
  if (!track) return

  const step = () => {
    if (Math.abs(velocityX) < 0.04) {
      inertiaRafId = null
      return
    }
    track.scrollLeft -= velocityX * 16
    velocityX *= 0.92
    inertiaRafId = requestAnimationFrame(step)
  }

  inertiaRafId = requestAnimationFrame(step)
}

const onPointerDown = (e: PointerEvent) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  const track = navTrackRef.value
  if (!track) return

  stopInertia()
  isDragging.value = true
  startX = e.clientX
  startScrollLeft = track.scrollLeft
  lastX = e.clientX
  lastTime = performance.now()
  velocityX = 0
  maxDragDistance = 0
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  const track = navTrackRef.value
  if (!track) return

  const dx = e.clientX - startX
  const now = performance.now()
  const dt = Math.max(1, now - lastTime)

  velocityX = (e.clientX - lastX) / dt
  lastX = e.clientX
  lastTime = now
  maxDragDistance = Math.max(maxDragDistance, Math.abs(dx))

  track.scrollLeft = startScrollLeft - dx
}

const finishPointerDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (maxDragDistance > 6 && Math.abs(velocityX) > 0.08) {
    startInertia()
  }
}

const onTrackClickCapture = (e: MouseEvent) => {
  if (maxDragDistance > 6) {
    e.preventDefault()
    e.stopPropagation()
    maxDragDistance = 0
  }
}

// Horizontal wheel / trackpad support on the bar
const onTrackWheel = (e: WheelEvent) => {
  const track = navTrackRef.value
  if (!track) return
  if (track.scrollWidth <= track.clientWidth) return

  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return
  }
  if (Math.abs(e.deltaY) > 0) {
    e.preventDefault()
    track.scrollLeft += e.deltaY
  }
}

// --- Keyboard Left / Right / Home / End Support ---
const onKeyDown = (e: KeyboardEvent) => {
  const total = props.sections.length
  if (total <= 1) return

  const currentIdx = props.sections.findIndex((s) => s.id === activeId.value)
  let nextIdx = currentIdx

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextIdx = (currentIdx + 1) % total
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    nextIdx = (currentIdx - 1 + total) % total
  } else if (e.key === 'Home') {
    e.preventDefault()
    nextIdx = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    nextIdx = total - 1
  } else {
    return
  }

  const targetSection = props.sections[nextIdx]
  if (targetSection) {
    scrollToSection(targetSection.id)
    tabRefs.value[targetSection.id]?.focus()
  }
}

watch(
  () => props.sections,
  async () => {
    await nextTick()
    updateIndicatorGeometry()
    evaluateActiveSection()
  },
  { deep: true }
)

onMounted(async () => {
  await nextTick()
  updateIndicatorGeometry()
  evaluateActiveSection()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  window.addEventListener('resize', onWindowResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
  window.removeEventListener('resize', onWindowResize)
  stopInertia()
  if (spyRafId !== null) cancelAnimationFrame(spyRafId)
  if (scrollUnlockTimer) clearTimeout(scrollUnlockTimer)
})
</script>

<template>
  <!-- top-16 md:top-20 aligns with the site header across all breakpoints (fixes 640-768px gap) -->
  <nav
    data-theme="light"
    aria-label="Itinerary sections"
    class="sticky top-16 md:top-20 z-30 w-full bg-bg-light/95 backdrop-blur-md border-y border-journey-deep/12 px-2 2xs:px-3 xs:px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20 2xl:px-24 select-none"
  >
    <div class="w-full max-w-7xl mx-auto">
      <div
        ref="navTrackRef"
        role="tablist"
        aria-orientation="horizontal"
        tabindex="0"
        @keydown="onKeyDown"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="finishPointerDrag"
        @pointercancel="finishPointerDrag"
        @mouseleave="finishPointerDrag"
        @wheel="onTrackWheel"
        @click.capture="onTrackClickCapture"
        class="itinerary-scroll-nav-track relative flex items-center justify-start sm:justify-between gap-6 sm:gap-8 overflow-x-auto focus:outline-none"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default'"
      >
        <button
          v-for="section in sections"
          :id="`scroll-tab-${section.id}`"
          :key="section.id"
          :ref="(el) => setTabRef(section.id, el)"
          type="button"
          role="tab"
          :name="`section-${section.id}`"
          :aria-selected="activeId === section.id"
          :aria-controls="section.id"
          @click="scrollToSection(section.id)"
          class="relative shrink-0 py-3.5 sm:py-4 cursor-pointer outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-intention-blue font-medium"
          :class="
            activeId === section.id
              ? 'text-journey-deep'
              : 'text-journey-deep/55 hover:text-journey-deep/85'
          "
        >
          <span class="card-eyebrow mb-0! pt-1 block whitespace-nowrap tracking-[0.18em]! font-medium">
            {{ section.label }}
          </span>
        </button>

        <!-- Smooth Gliding Active Underline (Thicker h-0.75 sm:h-1, vivid gold) -->
        <span
          v-if="indicator.ready"
          class="pointer-events-none absolute bottom-0 left-0 h-0.75 sm:h-1 bg-intention-gold rounded-full transition-all duration-300 ease-out will-change-transform"
          :style="{
            width: `${indicator.width}px`,
            transform: `translate3d(${indicator.left}px, 0, 0)`
          }"
          aria-hidden="true"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.itinerary-scroll-nav-track {
  -ms-overflow-style: none;
  scrollbar-width: none;
  touch-action: pan-x;
}

.itinerary-scroll-nav-track::-webkit-scrollbar {
  display: none;
}
</style>