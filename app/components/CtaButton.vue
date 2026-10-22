<!-- ~/app/components/CtaButton.vue -->

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    label: string
    variant?: 'dark' | 'light'
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    to: '',
    variant: 'dark', // 'dark' = heritage-gold for dark backgrounds | 'light' = intention-blue for light backgrounds
    disabled: false,
    ariaLabel: ''
  }
)

const isButton = computed(() => !props.to)
const resolvedAriaLabel = computed(() => props.ariaLabel || props.label)

// Extracted the massive class list so both NuxtLink and button share identical styling logic
const buttonClasses = computed(() => [
  'group relative inline-flex items-center justify-center font-uppercase font-semibold uppercase tracking-[0.25em] text-[11px] xs:text-xs px-6 pt-4.75 pb-4 outline-none shrink-0 cursor-pointer overflow-hidden',
  'active:scale-[0.96] transition-transform duration-500 ease-editorial',
  'focus-visible:ring-2 focus-visible:ring-offset-2',
  // Text & Focus Colors
  props.variant === 'dark'
    ? 'text-heritage-gold focus-visible:ring-heritage-gold focus-visible:ring-offset-bg-dark'
    : 'text-intention-blue focus-visible:ring-journey-deep focus-visible:ring-offset-white',
  
  // --- PSEUDO-ELEMENT BORDERS ---
  // ::before = 1px base border (fades out on hover AND tap)
  'before:absolute before:inset-0 before:rounded-sm before:pointer-events-none before:border-2 before:transition-opacity before:duration-500 before:ease-editorial',
  props.variant === 'dark' 
    ? 'before:border-heritage-gold/60 group-hover:before:opacity-0 group-active:before:opacity-0' 
    : 'before:border-action-blue group-hover:before:opacity-0 group-active:before:opacity-0',
    
  // ::after = 2px thick border (fades in on hover AND tap for smooth thickness change)
  'after:absolute after:inset-0 after:rounded-sm after:pointer-events-none after:border-2 after:opacity-0 group-hover:after:opacity-100 group-active:after:opacity-100 after:transition-opacity after:duration-500 after:ease-editorial',
  props.variant === 'dark' 
    ? 'after:border-heritage-gold' 
    : 'after:border-intention-blue'
])
</script>

<template>
  <!-- Link Mode -->
  <NuxtLink
    v-if="!isButton"
    :to="to"
    :aria-label="resolvedAriaLabel"
    :class="buttonClasses"
  >
    <!-- Jackpot Text Roll Container (Now explicitly flex-centered) -->
    <span class="relative flex items-center justify-center overflow-hidden leading-none">
      <span class="block transition-transform duration-500 ease-editorial group-hover:translate-y-[-120%] group-active:translate-y-[-120%]">
        {{ label }}
      </span>
      <span 
        class="absolute inset-0 flex items-center justify-center translate-y-[120%] transition-transform duration-500 ease-editorial group-hover:translate-y-0 group-active:translate-y-0" 
        aria-hidden="true"
      >
        {{ label }}
      </span>
    </span>
  </NuxtLink>

  <!-- Fallback Native Button Mode -->
  <button
    v-else
    :type="isButton ? 'button' : undefined"
    :disabled="disabled"
    :aria-label="resolvedAriaLabel"
    :class="buttonClasses"
  >
    <!-- Jackpot Text Roll Container -->
    <span class="relative flex items-center justify-center overflow-hidden leading-none">
      <span class="block transition-transform duration-500 ease-editorial group-hover:translate-y-[-120%] group-active:translate-y-[-120%]">
        {{ label }}
      </span>
      <span 
        class="absolute inset-0 flex items-center justify-center translate-y-[120%] transition-transform duration-500 ease-editorial group-hover:translate-y-0 group-active:translate-y-0" 
        aria-hidden="true"
      >
        {{ label }}
      </span>
    </span>
  </button>
</template>