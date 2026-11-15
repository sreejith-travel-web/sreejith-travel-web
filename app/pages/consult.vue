<!-- ~/app/pages/consult.vue -->
<script setup lang="ts">
import { watch, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'
import { useHead, useInitialAppLoad } from '#imports'
import IndexPage from './index.vue'
import { useConsultModal } from '~/composables/useConsultModal'

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

// IndexPage already sets canonical '/', so mark /consult noindex to prevent duplicate SERP entry
useHead({
  meta: [{ name: 'robots', content: 'noindex, follow' }]
})
</script>

<template>
  <IndexPage />
</template>