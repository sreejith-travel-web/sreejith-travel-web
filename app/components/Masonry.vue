<!-- ~/app/components/Masonry.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { LightboxOpenPayload, LightboxMediaItem } from '~/components/Lightbox.vue'

export interface MasonryImageEntry {
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  captionMob?: boolean
  captionPc?: boolean
  captionPC?: boolean
}

export interface MasonryBlockConfig {
  images: Array<string | MasonryImageEntry>
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
  captionPC?: boolean
}

interface NormalizedMasonryItem {
  index: number
  src: string
  width: number | null
  height: number | null
  hasDims: boolean
  ratio: number | null
  alt: string
  fullCaption: string
  truncatedCaption: string
  captionClass: string
  renderWidth: number
  renderHeight: number
}

const props = withDefaults(
  defineProps<{
    block: MasonryBlockConfig
    /** Max columns on desktop for 4+ images (3 for Itineraries, configurable for Journal) */
    maxCols?: 2 | 3 | 4
  }>(),
  {
    maxCols: 3
  }
)

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()

const rawImages = computed(() =>
  Array.isArray(props.block?.images) ? props.block.images : []
)
const rawCount = computed(() => rawImages.value.length)

// Responsive column count for 4+ Pinterest Masonry (SSR-safe default 2 -> updates on xl 1280px+ to maxCols)
const masonryColCount = ref(2)
let mql: MediaQueryList | null = null

const updateColCount = (e: MediaQueryListEvent | MediaQueryList) => {
  masonryColCount.value = e.matches ? props.maxCols : 2
}

onMounted(() => {
  mql = window.matchMedia('(min-width: 1280px)')
  updateColCount(mql)
  mql.addEventListener('change', updateColCount)
})

onUnmounted(() => {
  if (mql) mql.removeEventListener('change', updateColCount)
})

// --- HELPERS ---
const truncateCaption = (text: string) => {
  if (!text) return ''
  return text.length > 100 ? `${text.slice(0, 100)} ..` : text
}

const getCaptionVisibilityClass = (item: MasonryImageEntry | null) => {
  const rawMob = item?.captionMob ?? props.block?.captionMob
  const rawPc =
    item?.captionPc ?? item?.captionPC ?? props.block?.captionPc ?? props.block?.captionPC

  const showMob = rawMob !== undefined ? Boolean(rawMob) : true
  const showPc = rawPc !== undefined ? Boolean(rawPc) : true

  if (showMob && showPc) return 'block'
  if (showMob && !showPc) return 'block lg:hidden'
  if (!showMob && showPc) return 'hidden lg:block'
  return 'hidden'
}

const normalizeRawItem = (entry: string | MasonryImageEntry, idx: number): NormalizedMasonryItem => {
  const isObj = entry !== null && typeof entry === 'object'
  const src = isObj ? entry.src || '' : String(entry || '')
  const w = isObj ? Number(entry.width) : 0
  const h = isObj ? Number(entry.height) : 0
  const hasDims = w > 0 && h > 0

  const itemCaption = isObj && entry.caption ? String(entry.caption).trim() : ''
  const arrayCaption =
    Array.isArray(props.block?.captions) && props.block.captions[idx]
      ? String(props.block.captions[idx]).trim()
      : ''
  const blockCaption = props.block?.caption ? String(props.block.caption).trim() : ''

  const resolvedCaption = itemCaption || arrayCaption || blockCaption
  const explicitAlt = isObj && entry.alt ? String(entry.alt).trim() : ''
  const alt = explicitAlt || resolvedCaption || `Sreejith Travel Visual ${idx + 1}`

  return {
    index: idx,
    src,
    width: hasDims ? w : null,
    height: hasDims ? h : null,
    hasDims,
    ratio: hasDims ? w / h : null,
    alt,
    fullCaption: resolvedCaption,
    truncatedCaption: truncateCaption(resolvedCaption),
    captionClass: getCaptionVisibilityClass(isObj ? entry : null),
    renderWidth: hasDims ? w : 600,
    renderHeight: hasDims ? h : 600
  }
}

const getPairGridAndSizes = (avgRatio: number) => {
  if (avgRatio > 1.9) return { gridClass: 'grid-cols-1 lg:grid-cols-2' }
  if (avgRatio > 1.5) return { gridClass: 'grid-cols-1 md:grid-cols-2' }
  return { gridClass: 'grid-cols-2' }
}

// --- CASE 1: 1 IMAGE ---
const singleLayout = computed<NormalizedMasonryItem | null>(() => {
  if (rawCount.value !== 1 || !rawImages.value[0]) return null
  const item = normalizeRawItem(rawImages.value[0], 0)
  const renderWidth = item.hasDims && item.width ? item.width : 1200
  const renderHeight = item.hasDims && item.height ? item.height : 600

  return {
    ...item,
    renderWidth,
    renderHeight
  }
})

// --- CASE 2: 2 IMAGES ---
const pairLayout = computed(() => {
  if (rawCount.value !== 2) return null
  const items = rawImages.value.map((entry, i) => {
    const norm = normalizeRawItem(entry, i)
    const ratio = norm.hasDims && norm.ratio ? norm.ratio : 1
    return { ...norm, ratio }
  })

  const first = items[0]
  const second = items[1]
  if (!first || !second) return null

  const avgRatio = (first.ratio + second.ratio) / 2
  const { gridClass } = getPairGridAndSizes(avgRatio)
  const renderWidth = Math.round(600 * avgRatio)
  const renderHeight = 600

  return {
    gridClass,
    items: items.map((item) => ({
      ...item,
      renderWidth,
      renderHeight
    }))
  }
})

// --- CASE 3: 3 IMAGES ---
const trioLayout = computed(() => {
  if (rawCount.value !== 3) return null
  const normalized = rawImages.value.map((entry, i) => normalizeRawItem(entry, i))

  const hasProvidedGreaterThanOne = normalized.some(
    (item) => item.hasDims && item.ratio !== null && item.ratio > 1
  )
  let assignedTwoToOne = false

  const resolved = normalized.map((item) => {
    if (item.hasDims && item.width && item.height && item.ratio) {
      return {
        ...item,
        renderWidth: item.width,
        renderHeight: item.height,
        ratio: item.ratio
      }
    }
    if (!hasProvidedGreaterThanOne && !assignedTwoToOne) {
      assignedTwoToOne = true
      return {
        ...item,
        renderWidth: 1200,
        renderHeight: 600,
        ratio: 2
      }
    }
    return {
      ...item,
      renderWidth: 600,
      renderHeight: 600,
      ratio: 1
    }
  })

  let topIndex = 0
  for (let i = 1; i < resolved.length; i++) {
    const cur = resolved[i]
    const top = resolved[topIndex]
    if (cur && top && cur.ratio > top.ratio) {
      topIndex = i
    }
  }

  const topItem = resolved[topIndex]
  const bottomItems = resolved.filter((_, idx) => idx !== topIndex)
  const b0 = bottomItems[0]
  const b1 = bottomItems[1]

  if (!topItem || !b0 || !b1) return null

  const bottomAvgRatio = (b0.ratio + b1.ratio) / 2
  const { gridClass: bottomGridClass } = getPairGridAndSizes(bottomAvgRatio)
  const bottomRenderWidth = Math.round(600 * bottomAvgRatio)
  const bottomRenderHeight = 600

  return {
    top: topItem,
    bottomGridClass,
    bottom: bottomItems.map((item) => ({
      ...item,
      renderWidth: bottomRenderWidth,
      renderHeight: bottomRenderHeight
    }))
  }
})

// --- CASE 4: 4+ IMAGES (PINTEREST FLEX MASONRY, MAX 3 COLS IN ITINERARIES) ---
const masonryColumns = computed<NormalizedMasonryItem[][]>(() => {
  if (rawCount.value < 4) return []
  const count = masonryColCount.value
  const cols: Array<{ items: NormalizedMasonryItem[]; height: number }> = Array.from(
    { length: count },
    () => ({ items: [], height: 0 })
  )

  rawImages.value.forEach((entry, idx) => {
    const norm = normalizeRawItem(entry, idx)
    const renderWidth = norm.hasDims && norm.width ? norm.width : 600
    const renderHeight = norm.hasDims && norm.height ? norm.height : 600
    const ratio = renderWidth / renderHeight

    let shortestCol = cols[0]!
    for (let c = 1; c < cols.length; c++) {
      const candidate = cols[c]
      if (candidate && candidate.height < shortestCol.height) {
        shortestCol = candidate
      }
    }

    shortestCol.items.push({
      ...norm,
      renderWidth,
      renderHeight
    })

    shortestCol.height += 1 / ratio
  })

  return cols.map((col) => col.items)
})

const toLightboxItem = (item: NormalizedMasonryItem): LightboxMediaItem => ({
  src: item.src,
  width: item.renderWidth,
  height: item.renderHeight,
  caption: item.fullCaption || '',
  alt: item.alt
})

const openMasonryLightbox = (clickedIndex: number) => {
  if (rawCount.value === 1 && singleLayout.value) {
    emit('open-lightbox', { items: [toLightboxItem(singleLayout.value)], index: 0 })
  } else if (rawCount.value === 2 && pairLayout.value) {
    emit('open-lightbox', {
      items: pairLayout.value.items.map(toLightboxItem),
      index: clickedIndex
    })
  } else if (rawCount.value === 3 && trioLayout.value) {
    const allThree = [trioLayout.value.top, ...trioLayout.value.bottom].map(toLightboxItem)
    emit('open-lightbox', { items: allThree, index: clickedIndex })
  } else if (rawCount.value >= 4) {
    const flatItems: LightboxMediaItem[] = rawImages.value.map((entry, idx) => {
      const norm = normalizeRawItem(entry, idx)
      return {
        src: norm.src,
        width: norm.hasDims && norm.width ? norm.width : 600,
        height: norm.hasDims && norm.height ? norm.height : 600,
        caption: norm.fullCaption || '',
        alt: norm.alt
      }
    })
    emit('open-lightbox', { items: flatItems, index: clickedIndex })
  }
}
</script>

<template>
  <div class="w-full">
    <!-- CASE 1: Single Full-Width Image -->
    <div v-if="rawCount === 1 && singleLayout" class="w-full">
      <figure class="w-full flex flex-col max-w-5xl mx-auto">
        <button
          type="button"
          :aria-label="`View ${singleLayout.alt} in full screen`"
          :style="{ aspectRatio: `${singleLayout.renderWidth} / ${singleLayout.renderHeight}` }"
          class="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/8 shadow-xs cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          @click="openMasonryLightbox(0)"
        >
          <img
            :src="singleLayout.src"
            :alt="singleLayout.alt"
            :width="singleLayout.renderWidth"
            :height="singleLayout.renderHeight"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
          />
        </button>
        <figcaption
          v-if="singleLayout.truncatedCaption && singleLayout.captionClass !== 'hidden'"
          :class="[
            singleLayout.captionClass,
            'mt-2.5 px-1 section-subparagraph text-secondary-light/85 text-center'
          ]"
        >
          {{ singleLayout.truncatedCaption }}
        </figcaption>
      </figure>
    </div>

    <!-- CASE 2: Two Images (Averaged Aspect Ratio + Smart Breakpoint Stacking) -->
    <div
      v-else-if="rawCount === 2 && pairLayout"
      class="grid gap-4"
      :class="pairLayout.gridClass"
    >
      <figure
        v-for="(item, idx) in pairLayout.items"
        :key="idx"
        class="w-full flex flex-col max-w-6xl mx-auto"
      >
        <button
          type="button"
          :aria-label="`View ${item.alt} in full screen`"
          :style="{ aspectRatio: `${item.renderWidth} / ${item.renderHeight}` }"
          class="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/8 shadow-xs cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          @click="openMasonryLightbox(idx)"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            :width="item.renderWidth"
            :height="item.renderHeight"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
          />
        </button>
        <figcaption
          v-if="item.truncatedCaption && item.captionClass !== 'hidden'"
          :class="[
            item.captionClass,
            'mt-2.5 px-1 section-subparagraph text-secondary-light/85 text-center'
          ]"
        >
          {{ item.truncatedCaption }}
        </figcaption>
      </figure>
    </div>

    <!-- CASE 3: Three Images (Highest Ratio Top + Averaged Bottom Pair) -->
    <div v-else-if="rawCount === 3 && trioLayout" class="flex flex-col gap-4 w-full">
      <!-- Top Image (Highest Aspect Ratio) -->
      <figure class="w-full flex flex-col">
        <button
          type="button"
          :aria-label="`View ${trioLayout.top.alt} in full screen`"
          :style="{ aspectRatio: `${trioLayout.top.renderWidth} / ${trioLayout.top.renderHeight}` }"
          class="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/8 shadow-xs cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          @click="openMasonryLightbox(0)"
        >
          <img
            :src="trioLayout.top.src"
            :alt="trioLayout.top.alt"
            :width="trioLayout.top.renderWidth"
            :height="trioLayout.top.renderHeight"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
          />
        </button>
        <figcaption
          v-if="trioLayout.top.truncatedCaption && trioLayout.top.captionClass !== 'hidden'"
          :class="[
            trioLayout.top.captionClass,
            'mt-2.5 px-1 section-subparagraph text-secondary-light/85 text-center'
          ]"
        >
          {{ trioLayout.top.truncatedCaption }}
        </figcaption>
      </figure>

      <!-- Bottom 2 Images (Averaged Ratio + Smart Breakpoint Stacking) -->
      <div class="grid gap-4" :class="trioLayout.bottomGridClass">
        <figure
          v-for="(item, idx) in trioLayout.bottom"
          :key="idx"
          class="w-full flex flex-col"
        >
          <button
            type="button"
            :aria-label="`View ${item.alt} in full screen`"
            :style="{ aspectRatio: `${item.renderWidth} / ${item.renderHeight}` }"
            class="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/8 shadow-xs cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
            @click="openMasonryLightbox(idx + 1)"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              :width="item.renderWidth"
              :height="item.renderHeight"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
            />
          </button>
          <figcaption
            v-if="item.truncatedCaption && item.captionClass !== 'hidden'"
            :class="[
              item.captionClass,
              'mt-2.5 px-1 section-subparagraph text-secondary-light/85 text-center'
            ]"
          >
            {{ item.truncatedCaption }}
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- CASE 4: 4+ Images (2-Col Flex Masonry on Mobile/Tablet -> maxCols [3] on xl+) -->
    <div v-else-if="rawCount >= 4" class="flex flex-row items-start gap-4 w-full">
      <div
        v-for="(col, colIdx) in masonryColumns"
        :key="colIdx"
        class="flex-1 flex flex-col gap-4 min-w-0"
      >
        <figure
          v-for="(item, itemIdx) in col"
          :key="itemIdx"
          class="w-full flex flex-col items-center"
        >
          <button
            type="button"
            :aria-label="`View ${item.alt} in full screen`"
            :style="{ aspectRatio: `${item.renderWidth} / ${item.renderHeight}` }"
            class="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/8 shadow-xs cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
            @click="openMasonryLightbox(item.index)"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              :width="item.renderWidth"
              :height="item.renderHeight"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
            />
          </button>
          <figcaption
            v-if="item.truncatedCaption && item.captionClass !== 'hidden'"
            :class="[
              item.captionClass,
              'mt-2.5 px-1 section-subparagraph text-secondary-light/85 text-center'
            ]"
          >
            {{ item.truncatedCaption }}
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>