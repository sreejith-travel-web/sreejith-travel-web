<!-- ~/app/components/ConsultModal.vue -->
<script setup lang="ts">
import { reactive, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useState } from '#imports'
import type Lenis from 'lenis'
import { useConsultModal, type ConsultPurposeValue } from '~/composables/useConsultModal'

export interface ConsultSubmissionPayload {
  referenceCode: string
  name: string
  email: string
  phone: string
  purpose: Exclude<ConsultPurposeValue, ''>
  purposeLabel: string
  message: string
  submittedAt: string
}

const MODAL_CONTACT = {
  whatsappHref: 'https://wa.me/919943360478',
  emailHref: 'mailto:mokshastories@mokshastories.com',
  phoneHref: 'tel:+919943360478'
} as const

const PURPOSE_OPTIONS: ReadonlyArray<{
  value: Exclude<ConsultPurposeValue, ''>
  label: string
}> = [
  { value: 'private-journey', label: 'Plan a Private Journey' },
  { value: 'customise-itinerary', label: 'Customise an Itinerary' },
  { value: 'partner-collaboration', label: 'Travel Partner Collaboration' },
  { value: 'general-question', label: 'General Question' }
]

type ConsultFieldKey = 'name' | 'email' | 'phone' | 'purpose'

const emit = defineEmits<{
  (e: 'submitted', payload: ConsultSubmissionPayload): void
}>()

const route = useRoute()
const lenisState = useState<Lenis | null>('lenis-instance', () => null)
const { isOpen, initialPurpose, closeConsultModal } = useConsultModal()

const modalCardRef = ref<HTMLElement | null>(null)
const firstInputRef = ref<HTMLInputElement | null>(null)
let previouslyFocusedEl: HTMLElement | null = null

const form = reactive<{
  name: string
  email: string
  phone: string
  purpose: ConsultPurposeValue
  message: string
}>({
  name: '',
  email: '',
  phone: '',
  purpose: '',
  message: ''
})

const touched = reactive<Record<ConsultFieldKey, boolean>>({
  name: false,
  email: false,
  phone: false,
  purpose: false
})

const errors = reactive<Record<ConsultFieldKey, string>>({
  name: '',
  email: '',
  phone: '',
  purpose: ''
})

const hasAttemptedSubmit = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const referenceCode = ref('')
const lastSubmission = ref<ConsultSubmissionPayload | null>(null)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_CHARS_RE = /^[+\d][\d\s\-().]{5,20}$/

const validateName = (): string => {
  const v = form.name.trim()
  if (!v) return 'Please enter your name.'
  if (v.length < 2) return 'Enter at least 2 characters.'
  if (v.length > 80) return 'Maximum 80 characters.'
  return ''
}

const validatePurpose = (): string => {
  if (!form.purpose) return 'Please select a purpose.'
  return ''
}

const validateEmailFormat = (v: string): string => {
  if (!v) return ''
  return EMAIL_RE.test(v) ? '' : 'Enter a valid email address.'
}

const validatePhoneFormat = (v: string): string => {
  if (!v) return ''
  const digitCount = v.replace(/\D/g, '').length
  return PHONE_CHARS_RE.test(v) && digitCount >= 7 && digitCount <= 15
    ? ''
    : 'Enter a valid phone (7–15 digits).'
}

// Cross-validates Email + Phone: only ONE valid contact method is required
const syncContactErrors = (requireAtLeastOne: boolean) => {
  const emailVal = form.email.trim()
  const phoneVal = form.phone.trim()

  if (!emailVal && !phoneVal) {
    if (requireAtLeastOne) {
      errors.email = 'Enter your email or phone.'
      errors.phone = 'Enter your email or phone.'
    } else {
      errors.email = ''
      errors.phone = ''
    }
    return
  }

  errors.email = emailVal && (touched.email || requireAtLeastOne) ? validateEmailFormat(emailVal) : ''
  errors.phone = phoneVal && (touched.phone || requireAtLeastOne) ? validatePhoneFormat(phoneVal) : ''
}

const onFieldBlur = (key: ConsultFieldKey) => {
  const rawVal = String(form[key] ?? '').trim()
  if (!rawVal && !touched[key] && !hasAttemptedSubmit.value) return

  touched[key] = true

  if (key === 'name') {
    errors.name = validateName()
  } else if (key === 'purpose') {
    errors.purpose = validatePurpose()
  } else {
    syncContactErrors(hasAttemptedSubmit.value)
  }
}

const onFieldInput = (key: ConsultFieldKey) => {
  if (key === 'name') {
    if (touched.name || hasAttemptedSubmit.value) {
      errors.name = validateName()
    }
    return
  }

  if (key === 'purpose') {
    if (touched.purpose || hasAttemptedSubmit.value) {
      errors.purpose = validatePurpose()
    }
    return
  }

  if (touched.email || touched.phone || hasAttemptedSubmit.value) {
    syncContactErrors(hasAttemptedSubmit.value)
  }
}

const validateAll = (): boolean => {
  hasAttemptedSubmit.value = true
  touched.name = true
  touched.email = true
  touched.phone = true
  touched.purpose = true

  errors.name = validateName()
  errors.purpose = validatePurpose()
  syncContactErrors(true)

  return !errors.name && !errors.email && !errors.phone && !errors.purpose
}

const resetFormState = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.purpose = initialPurpose.value || ''
  form.message = ''
  ;(['name', 'email', 'phone', 'purpose'] as ConsultFieldKey[]).forEach((k) => {
    touched[k] = false
    errors[k] = ''
  })
  hasAttemptedSubmit.value = false
  isSubmitting.value = false
  isSubmitted.value = false
}

const handleSubmit = async () => {
  if (!validateAll()) {
    await nextTick()
    const firstInvalid = modalCardRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')
    firstInvalid?.focus({ preventScroll: true })
    return
  }

  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 480))

  const rand = Math.floor(1000 + Math.random() * 9000)
  const generatedRef = `ST-CNS-${new Date().getFullYear()}-${rand}`
  const resolvedMessage = form.message.trim() || 'General Inquiry'
  const purposeValue = form.purpose as Exclude<ConsultPurposeValue, ''>
  const purposeLabel =
    PURPOSE_OPTIONS.find((opt) => opt.value === purposeValue)?.label || purposeValue

  const payload: ConsultSubmissionPayload = {
    referenceCode: generatedRef,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    purpose: purposeValue,
    purposeLabel,
    message: resolvedMessage,
    submittedAt: new Date().toISOString()
  }

  referenceCode.value = generatedRef
  lastSubmission.value = payload
  isSubmitting.value = false
  isSubmitted.value = true
  emit('submitted', payload)
}

const handleSendAnother = () => {
  resetFormState()
  nextTick(() => firstInputRef.value?.focus({ preventScroll: true }))
}

// Zero-CLS Scrollbar-Compensated Background Lock + Lenis Pause
const applyScrollLock = (locked: boolean) => {
  if (!import.meta.client) return
  const docEl = document.documentElement
  const body = document.body

  if (locked) {
    const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth)
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    body.classList.add('consult-modal-lock')
    lenisState.value?.stop()
  } else {
    body.classList.remove('consult-modal-lock')
    body.style.paddingRight = ''
    lenisState.value?.start()
  }
}

const handleClose = () => {
  closeConsultModal({ restoreUrl: true })
}

const onWindowKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    handleClose()
    return
  }

  if (e.key === 'Tab' && modalCardRef.value) {
    const focusables = Array.from(
      modalCardRef.value.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
    if (!focusables.length) return
    const first = focusables[0]!
    const last = focusables[focusables.length - 1]!

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(isOpen, (open) => {
  applyScrollLock(open)

  if (open) {
    if (initialPurpose.value && !form.purpose) {
      form.purpose = initialPurpose.value
    }
    if (import.meta.client) {
      previouslyFocusedEl = document.activeElement as HTMLElement | null
      nextTick(() => {
        firstInputRef.value?.focus({ preventScroll: true })
      })
    }
  } else if (import.meta.client && previouslyFocusedEl) {
    previouslyFocusedEl.focus?.({ preventScroll: true })
    previouslyFocusedEl = null
  }
})

watch(
  () => route.path,
  (nextPath) => {
    const clean = nextPath.length > 1 && nextPath.endsWith('/') ? nextPath.slice(0, -1) : nextPath
    if (isOpen.value && clean.toLowerCase() !== '/consult') {
      closeConsultModal({ restoreUrl: false })
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
})

onBeforeUnmount(() => {
  applyScrollLock(false)
  if (import.meta.client) {
    window.removeEventListener('keydown', onWindowKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="consult-overlay">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-9990 flex items-center justify-center p-3 sm:p-5 bg-journey-deep/52 backdrop-blur-xs"
        @pointerdown.self="handleClose"
      >
        <div
          ref="modalCardRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consult-modal-heading"
          aria-describedby="consult-modal-subtitle"
          data-lenis-prevent
          class="consult-modal-surface relative isolate w-full max-w-136 max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl border border-white/65 shadow-[0_26px_70px_-14px_rgba(4,24,46,0.42)] px-5 py-6 sm:px-9 sm:py-7.5 text-journey-deep"
        >
          <!-- Subtle Top-Right Topographic Golden Contour Waves -->
          <svg
            aria-hidden="true"
            viewBox="0 0 240 150"
            fill="none"
            class="pointer-events-none absolute top-0 right-0 w-44 sm:w-56 h-auto text-dark-gold/26 select-none -z-10"
          >
            <path
              d="M36 -8C72 28 118 32 162 14C198 -1 224 8 248 26"
              stroke="currentColor"
              stroke-width="1.15"
            />
            <path
              d="M68 -12C102 36 146 46 190 29C216 19 234 26 250 44"
              stroke="currentColor"
              stroke-width="1.15"
            />
            <path
              d="M108 -10C136 44 176 62 216 49C232 44 244 50 254 64"
              stroke="currentColor"
              stroke-width="1.15"
            />
          </svg>

          <!-- Top-Right Close Button -->
          <button
            type="button"
            aria-label="Close conversation popup"
            class="absolute top-3.5 right-3.5 sm:top-4.5 sm:right-4.5 w-9 h-9 rounded-full flex items-center justify-center text-journey-deep/75 hover:text-journey-deep hover:bg-journey-deep/6 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
            @click="handleClose"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4.5 h-4.5"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <!-- HEADER LOCKUP -->
          <div class="flex flex-col items-center text-center mb-4.5 sm:mb-5 px-4">
            <div class="inline-flex items-center gap-2.5 sm:gap-3 mb-2">
              <span class="w-6 sm:w-8 h-px bg-dark-gold/75" aria-hidden="true" />
              <span class="font-uppercase text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-journey-deep/85 leading-none pt-0.5">
                LET'S CONNECT
              </span>
              <span class="w-6 sm:w-8 h-px bg-dark-gold/75" aria-hidden="true" />
            </div>

            <h2
              id="consult-modal-heading"
              class="font-primary text-[24px] sm:text-[30px] font-normal tracking-tight text-journey-deep leading-[1.18] mb-1.5"
            >
              Start a Conversation
            </h2>

            <p
              id="consult-modal-subtitle"
              class="font-primary text-[13.5px] sm:text-[14.5px] text-secondary-light/90 leading-relaxed max-w-md"
            >
              Questions, ideas or possibilities—tell me what's on your mind.
            </p>
          </div>

          <!-- ACTIVE ENQUIRY FORM (Zero-Shift Fixed Error Slots) -->
          <form
            v-if="!isSubmitted"
            id="consult-enquiry-form"
            novalidate
            class="flex flex-col"
            @submit.prevent="handleSubmit"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 sm:gap-y-1">
              <!-- 1. Name (Required) -->
              <div class="flex flex-col">
                <label
                  for="consult-field-name"
                  class="font-primary section-subparagraph text-journey-deep leading-none mb-1.5"
                >
                  Name
                </label>
                <input
                  id="consult-field-name"
                  ref="firstInputRef"
                  v-model="form.name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  maxlength="80"
                  placeholder="Your name"
                  :aria-invalid="Boolean(errors.name)"
                  :aria-describedby="errors.name ? 'consult-error-name' : undefined"
                  class="consult-input"
                  :class="errors.name ? 'consult-input-error' : ''"
                  @blur="onFieldBlur('name')"
                  @input="onFieldInput('name')"
                />
                <p
                  id="consult-error-name"
                  :role="errors.name ? 'alert' : undefined"
                  :aria-hidden="!errors.name"
                  class="h-4 mt-0.5 text-[11px] leading-4 text-terracotta font-medium truncate transition-opacity duration-150"
                  :class="errors.name ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
                >
                  {{ errors.name || '\u00A0' }}
                </p>
              </div>

              <!-- 2. Email (Email OR Phone Required) -->
              <div class="flex flex-col">
                <label
                  for="consult-field-email"
                  class="font-primary section-subparagraph text-journey-deep leading-none mb-1.5"
                >
                  Email
                </label>
                <input
                  id="consult-field-email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  maxlength="120"
                  placeholder="Your email address"
                  :aria-invalid="Boolean(errors.email)"
                  :aria-describedby="errors.email ? 'consult-error-email' : undefined"
                  class="consult-input"
                  :class="errors.email ? 'consult-input-error' : ''"
                  @blur="onFieldBlur('email')"
                  @input="onFieldInput('email')"
                />
                <p
                  id="consult-error-email"
                  :role="errors.email ? 'alert' : undefined"
                  :aria-hidden="!errors.email"
                  class="h-4 mt-0.5 text-[11px] leading-4 text-terracotta font-medium truncate transition-opacity duration-150"
                  :class="errors.email ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
                >
                  {{ errors.email || '\u00A0' }}
                </p>
              </div>

              <!-- 3. Phone (Email OR Phone Required) -->
              <div class="flex flex-col">
                <label
                  for="consult-field-phone"
                  class="font-primary section-subparagraph text-journey-deep leading-none mb-1.5"
                >
                  Phone
                </label>
                <input
                  id="consult-field-phone"
                  v-model="form.phone"
                  name="phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  maxlength="22"
                  placeholder="Your phone number"
                  :aria-invalid="Boolean(errors.phone)"
                  :aria-describedby="errors.phone ? 'consult-error-phone' : undefined"
                  class="consult-input"
                  :class="errors.phone ? 'consult-input-error' : ''"
                  @blur="onFieldBlur('phone')"
                  @input="onFieldInput('phone')"
                />
                <p
                  id="consult-error-phone"
                  :role="errors.phone ? 'alert' : undefined"
                  :aria-hidden="!errors.phone"
                  class="h-4 mt-0.5 text-[11px] leading-4 text-terracotta font-medium truncate transition-opacity duration-150"
                  :class="errors.phone ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
                >
                  {{ errors.phone || '\u00A0' }}
                </p>
              </div>

              <!-- 4. Purpose (Required) -->
              <div class="flex flex-col">
                <label
                  for="consult-field-purpose"
                  class="font-primary section-subparagraph text-journey-deep leading-none mb-1.5"
                >
                  Purpose
                </label>
                <div class="relative">
                  <select
                    id="consult-field-purpose"
                    v-model="form.purpose"
                    name="purpose"
                    autocomplete="off"
                    :aria-invalid="Boolean(errors.purpose)"
                    :aria-describedby="errors.purpose ? 'consult-error-purpose' : undefined"
                    class="consult-input appearance-none pr-9 cursor-pointer"
                    :class="[
                      !form.purpose ? 'text-journey-deep/45!' : '',
                      errors.purpose ? 'consult-input-error' : ''
                    ]"
                    @blur="onFieldBlur('purpose')"
                    @change="onFieldInput('purpose')"
                  >
                    <option value="" disabled>Select a purpose</option>
                    <option
                      v-for="opt in PURPOSE_OPTIONS"
                      :key="opt.value"
                      :value="opt.value"
                      class="text-journey-deep bg-white"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-journey-deep/55"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <p
                  id="consult-error-purpose"
                  :role="errors.purpose ? 'alert' : undefined"
                  :aria-hidden="!errors.purpose"
                  class="h-4 mt-0.5 text-[11px] leading-4 text-terracotta font-medium truncate transition-opacity duration-150"
                  :class="errors.purpose ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
                >
                  {{ errors.purpose || '\u00A0' }}
                </p>
              </div>

              <!-- 5. What's on your mind? (Optional — Defaults Silently to 'General Inquiry' on Submit) -->
              <div class="sm:col-span-2 flex flex-col pt-0.5">
                <label
                  for="consult-field-message"
                  class="font-primary section-subparagraph text-journey-deep leading-none mb-1.5"
                >
                  What's on your mind?
                </label>
                <textarea
                  id="consult-field-message"
                  v-model="form.message"
                  name="message"
                  rows="3"
                  autocomplete="off"
                  maxlength="1500"
                  placeholder="Share your question, idea or journey..."
                  class="consult-input h-22 resize-none"
                />
              </div>
            </div>

            <!-- Centered Desktop / Full-Width Mobile Gold CTA -->
            <div class="mt-4.5 flex justify-center">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full sm:w-60 py-3 px-7 rounded-lg bg-warm-gold hover:bg-heritage-gold active:scale-[0.99] disabled:opacity-65 text-journey-deep font-uppercase text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.18em] leading-none pt-3.5 shadow-[0_6px_16px_-4px_rgba(212,131,2,0.42)] transition-all duration-250 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-journey-deep"
              >
                {{ isSubmitting ? 'SENDING...' : 'SEND ENQUIRY' }}
              </button>
            </div>
          </form>

          <!-- SUBMISSION CONFIRMATION VIEW -->
          <div
            v-else
            role="status"
            aria-live="polite"
            class="min-h-64 py-6 px-4 rounded-2xl bg-white/75 border border-dark-gold/25 text-center flex flex-col items-center justify-center gap-3"
          >
            <div class="w-10 h-10 rounded-full bg-dark-gold/15 text-dark-gold flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" class="w-5 h-5">
                <polyline stroke-linecap="round" stroke-linejoin="round" points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 class="font-primary text-lg sm:text-xl font-semibold text-journey-deep">
              Thank you, {{ (lastSubmission?.name || form.name).trim().split(/\s+/)[0] }}.
            </h3>
            <p class="font-primary text-[13.5px] sm:text-[14px] text-secondary-light max-w-sm leading-relaxed">
              Your note has been received ({{ referenceCode }}). I will get back to you personally shortly.
            </p>
            <button
              type="button"
              class="mt-1 font-uppercase text-[11px] font-semibold uppercase tracking-[0.18em] text-intention-blue hover:text-journey-deep underline underline-offset-4 cursor-pointer"
              @click="handleSendAnother"
            >
              Send Another Note
            </button>
          </div>

          <!-- CONNECT DIRECTLY FOOTER -->
          <div class="mt-5 pt-4 border-t border-journey-deep/10 flex flex-col items-center">
            <span class="font-primary section-paragraph text-journey-deep mb-3">
              Connect directly
            </span>

            <div class="flex items-center justify-center gap-7 sm:gap-9">
              <!-- 1. WhatsApp -->
              <a
                :href="MODAL_CONTACT.whatsappHref"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat directly on WhatsApp"
                class="group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <span class="w-10 h-10 rounded-full bg-[#38A852] text-white shadow-xs flex items-center justify-center transition-transform duration-250 group-hover:scale-108 group-focus-visible:ring-2 group-focus-visible:ring-journey-deep">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.24-5.01-4.44-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.45.27-.29.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.03.9 2.18.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.26 1.64 2.04 1.13 1.01 2.08 1.32 2.38 1.47.29.15.46.12.64-.07.17-.2.74-.86.94-1.15.2-.29.39-.24.66-.15.27.1 1.72.81 2.01.96.29.15.49.22.56.34.08.13.08.72-.16 1.4Z" />
                  </svg>
                </span>
                <span class="font-primary text-[11.5px] text-journey-deep/80 group-hover:text-journey-deep transition-colors">
                  WhatsApp
                </span>
              </a>

              <!-- 2. Email -->
              <a
                :href="MODAL_CONTACT.emailHref"
                aria-label="Send an email directly"
                class="group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <span class="w-10 h-10 rounded-full bg-[#D65745] text-white shadow-xs flex items-center justify-center transition-transform duration-250 group-hover:scale-108 group-focus-visible:ring-2 group-focus-visible:ring-journey-deep">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="w-4.5 h-4.5">
                    <rect width="18" height="14" x="3" y="5" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <span class="font-primary text-[11.5px] text-journey-deep/80 group-hover:text-journey-deep transition-colors">
                  Email
                </span>
              </a>

              <!-- 3. Phone -->
              <a
                :href="MODAL_CONTACT.phoneHref"
                aria-label="Call directly by phone"
                class="group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <span class="w-10 h-10 rounded-full bg-[#C69749] text-white shadow-xs flex items-center justify-center transition-transform duration-250 group-hover:scale-108 group-focus-visible:ring-2 group-focus-visible:ring-journey-deep">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-4.5 h-4.5">
                    <path d="M19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z" />
                  </svg>
                </span>
                <span class="font-primary text-[11.5px] text-journey-deep/80 group-hover:text-journey-deep transition-colors">
                  Phone
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.consult-modal-surface {
  background-color: #fbf8f4;
  background-image:
    radial-gradient(88% 72% at 6% 4%, rgba(252, 224, 191, 0.88) 0%, rgba(253, 238, 219, 0.42) 48%, transparent 78%),
    radial-gradient(86% 76% at 96% 96%, rgba(209, 236, 249, 0.88) 0%, rgba(228, 244, 251, 0.45) 50%, transparent 80%),
    linear-gradient(145deg, #fdf3e6 0%, #fcfaf7 50%, #ebf6fb 100%);
  scrollbar-width: thin;
}

.consult-input {
  width: 100%;
  border-radius: 0.55rem;
  background-color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(20, 38, 56, 0.14);
  padding: 0.5625rem 0.875rem;
  font-family: var(--font-primary);
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-journey-deep);
  outline: none;
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease;
}

.consult-input:not(textarea) {
  height: 2.625rem;
}

.consult-input::placeholder {
  color: rgba(20, 38, 56, 0.42);
}

.consult-input:focus {
  background-color: #ffffff;
  border-color: var(--color-intention-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-intention-blue) 15%, transparent);
}

.consult-input-error {
  border-color: color-mix(in srgb, var(--color-terracotta) 78%, transparent);
}

.consult-input-error:focus {
  border-color: var(--color-terracotta);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-terracotta) 16%, transparent);
}

.consult-overlay-enter-active,
.consult-overlay-leave-active {
  transition: opacity 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.consult-overlay-enter-active .consult-modal-surface,
.consult-overlay-leave-active .consult-modal-surface {
  transition:
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.consult-overlay-enter-from,
.consult-overlay-leave-to {
  opacity: 0;
}

.consult-overlay-enter-from .consult-modal-surface,
.consult-overlay-leave-to .consult-modal-surface {
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.97);
}
</style>

<style>
body.consult-modal-lock {
  overflow: hidden;
}
</style>