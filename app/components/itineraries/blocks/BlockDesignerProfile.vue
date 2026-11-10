<!-- ~/app/components/itineraries/blocks/BlockDesignerProfile.vue -->
<script setup lang="ts">
export interface ItineraryDesignerProfileBlockData {
  sectionId?: string
  eyebrow: string
  name: string
  bio: string
  avatar: string
  avatarAlt?: string
}

defineProps<{
  data: ItineraryDesignerProfileBlockData
}>()
</script>

<template>
  <aside
    :id="data.sectionId"
    :aria-label="`About route designer ${data.name}`"
    v-motion-fade-up
    class="group scroll-mt-36 relative w-full rounded-2xl sm:rounded-3xl bg-linear-to-br from-soft-cream/28 via-soft-cream/10 to-surface-light border border-dark-gold/25 hover:border-dark-gold/45 p-6 sm:p-8 md:p-10 shadow-2xs hover:shadow-sm transition-all duration-500 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 md:gap-10"
  >
    <!-- Circular Avatar (Strict 1:1 Aspect Ratio) -->
    <div class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-full overflow-hidden border-2 border-dark-gold/40 bg-surface-light shadow-xs shrink-0 z-10">
      <img
        :src="data.avatar"
        :alt="data.avatarAlt || data.name"
        width="288"
        height="288"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-center select-none transition-transform duration-700 ease-editorial group-hover:scale-105"
      />
    </div>

    <!-- Designer Details -->
    <div class="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10 flex-1">
      <span class="eyebrow-text mx-0! pt-0.5 text-intention-blue font-medium mb-2">
        {{ data.eyebrow }}
      </span>

      <h3 class="section-smaller-subtitle font-medium text-journey-deep mb-3 sm:mb-3.5">
        {{ data.name }}
      </h3>

      <p class="section-paragraph text-secondary-light/90 max-w-2xl">
        {{ data.bio }}
      </p>
    </div>

    <!-- Subtle Light-Theme Geometric Crest Watermark -->
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      class="pointer-events-none absolute -bottom-8 -right-4 w-48 h-48 sm:w-56 sm:h-56 text-dark-gold/10 select-none transition-transform duration-700 ease-editorial group-hover:scale-105 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
      aria-hidden="true"
    >
      <path d="M12 2L2 22h20L12 2zm0 4.2L18.4 19H5.6L12 6.2z" />
    </svg>
  </aside>
</template>