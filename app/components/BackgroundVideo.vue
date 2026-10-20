<!-- ~/app/components/BackgroundVideo.vue -->

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  videoWebm?: string
  videoMp4?: string
  posterDesktop: string
  posterMobile?: string
  posterDesktopWidth?: number
  posterDesktopHeight?: number
  posterMobileWidth?: number
  posterMobileHeight?: number
  alt?: string
  tintClass?: string
  isActive?: boolean
  priority?: boolean
}>(), {
  videoWebm: '',
  videoMp4: '',
  posterMobile: '',
  posterDesktopWidth: 1280,
  posterDesktopHeight: 720,
  posterMobileWidth: 540,
  posterMobileHeight: 720,
  alt: 'Sreejith Regenerative Travel Experience Background Video',
  tintClass: 'bg-linear-to-b from-journey-deep/40 via-journey-deep/60 to-journey-deep/80',
  isActive: true,
  priority: true
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const shouldLoadVideo = ref(false)

const playVideo = async () => {
  if (!videoRef.value) return

  // If the browser already has enough frames buffered (e.g., returning from another slide/page)
  if (videoRef.value.readyState >= 3) {
    isPlaying.value = true
  }

  try {
    await videoRef.value.play()
  } catch {
    // Autoplay blocked by OS Low Power Mode or Data Saver:
    // Silently keep the high-res WebP poster visible.
  }
}

const pauseVideo = () => {
  if (!videoRef.value) return
  videoRef.value.pause()
}

const onVideoPlaying = () => {
  isPlaying.value = true
}

watch(() => props.isActive, async (active) => {
  if (!import.meta.client) return

  if (active) {
    if (!shouldLoadVideo.value) {
      shouldLoadVideo.value = true
      await nextTick()
    }
    playVideo()
  } else {
    pauseVideo()
  }
})

onMounted(async () => {
  if (props.isActive) {
    shouldLoadVideo.value = true
    await nextTick()
    playVideo()
  }
})

onBeforeUnmount(() => {
  pauseVideo()
})
</script>

<template>
  <div 
    class="relative w-full h-full overflow-hidden bg-journey-deep pointer-events-none select-none"
    aria-hidden="true"
  >
    <!-- 1. Native HTML5 Video Layer (z-0) -->
    <video
      v-if="shouldLoadVideo && (videoWebm || videoMp4)"
      ref="videoRef"
      muted
      loop
      playsinline
      autoplay
      preload="auto"
      tabindex="-1"
      class="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
      @playing="onVideoPlaying"
    >
      <source v-if="videoWebm" :src="videoWebm" type="video/webm" />
      <source v-if="videoMp4" :src="videoMp4" type="video/mp4" />
    </video>

    <!-- 2. SSR LCP Poster Layer (z-10) - Dissolves instantly when video plays -->
    <div
      :class="[
        'absolute inset-0 w-full h-full transition-opacity duration-700 ease-out z-10 will-change-opacity',
        isPlaying ? 'opacity-0' : 'opacity-100'
      ]"
    >
      <picture class="block w-full h-full">
        <source
          media="(min-width: 768px)"
          :srcset="posterDesktop"
          type="image/webp"
          :width="posterDesktopWidth"
          :height="posterDesktopHeight"
        />
        <source
          media="(max-width: 767px)"
          :srcset="posterMobile || posterDesktop"
          type="image/webp"
          :width="posterMobileWidth"
          :height="posterMobileHeight"
        />
        <img
          :src="posterDesktop"
          :alt="alt"
          :width="posterDesktopWidth"
          :height="posterDesktopHeight"
          :fetchpriority="priority ? 'high' : 'auto'"
          :loading="priority ? 'eager' : 'lazy'"
          :decoding="priority ? 'sync' : 'async'"
          class="w-full h-full object-cover object-center"
        />
      </picture>
    </div>

    <!-- 3. Unified Section Tint Overlay (z-20) -->
    <div
      v-if="tintClass"
      :class="['absolute inset-0 w-full h-full pointer-events-none z-20', tintClass]"
    />
  </div>
</template>