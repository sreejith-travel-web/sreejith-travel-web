<!-- ~/app/pages/consult.vue -->
<script setup lang="ts">
import { watch, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'
import { useHead, useInitialAppLoad } from '#imports'
import IndexPage from './index.vue'
import { useConsultModal } from '~/composables/useConsultModal'
import { useTravelSeo } from '~/composables/useTravelSeo'

const CONSULT_LANDING_DELAY_MS = 2000

const isInitialAppLoad = useInitialAppLoad()
const { openConsultModal } = useConsultModal()

let openTimerId: ReturnType<typeof setTimeout> | null = null
let isPageActive = true

const clearConsultTimer = () => {
  if (openTimerId !== null) {
    clearTimeout(openTimerId)
    openTimerId = null
  }
}

const scheduleConsultPopup = () => {
  if (!import.meta.client || !isPageActive || isInitialAppLoad.value) return
  clearConsultTimer()

  openTimerId = setTimeout(() => {
    if (!isPageActive) return
    openConsultModal({ syncUrl: false })
  }, CONSULT_LANDING_DELAY_MS)
}

watch(isInitialAppLoad, (stillLoading) => {
  if (!stillLoading) {
    scheduleConsultPopup()
  }
})

onMounted(() => {
  isPageActive = true
  scheduleConsultPopup()
})

onActivated(() => {
  isPageActive = true
  scheduleConsultPopup()
})

onDeactivated(() => {
  isPageActive = false
  clearConsultTimer()
})

onBeforeUnmount(() => {
  isPageActive = false
  clearConsultTimer()
})

// Dedicated Social / Link-Share SEO Meta for https://sreejith.travel/consult
useTravelSeo({
  pageTitle: 'Start a Conversation & Private Travel Consultation',
  pageDesc:
    'Questions, route ideas, or partnership possibilities across Kerala and South India? Start a direct conversation with Sreejith.',
  canonicalPath: '/consult',
  ogImage: '/images/og/consult.jpg',
  ogImageAlt: 'Start a Conversation — Sree Jith Travel',
  pageType: 'contact',
  breadcrumbName: 'Consult'
})

// Social crawlers (WhatsApp/Meta/LinkedIn/X) ignore noindex and render the full OG card,
// while Google keeps '/' as your sole homepage without duplicate-body warnings
useHead({
  meta: [{ name: 'robots', content: 'noindex, follow' }]
})
</script>

<template>
  <IndexPage />
</template>