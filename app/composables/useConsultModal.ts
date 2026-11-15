// ~/app/composables/useConsultModal.ts
import { useState } from '#imports'

export type ConsultPurposeValue =
  | ''
  | 'private-journey'
  | 'customise-itinerary'
  | 'partner-collaboration'
  | 'general-question'

export interface OpenConsultOptions {
  purpose?: ConsultPurposeValue
  /** Defaults to true; updates browser URL bar to /consult while open */
  syncUrl?: boolean
}

export const useConsultModal = () => {
  const isOpen = useState<boolean>('consult-modal-open', () => false)
  const initialPurpose = useState<ConsultPurposeValue>('consult-modal-purpose', () => '')
  const returnPath = useState<string>('consult-modal-return-path', () => '/')

  const openConsultModal = (options: OpenConsultOptions = {}) => {
    initialPurpose.value = options.purpose ?? ''

    if (import.meta.client) {
      const currentFull =
        window.location.pathname + window.location.search + window.location.hash
      const cleanPathname =
        window.location.pathname.length > 1 && window.location.pathname.endsWith('/')
          ? window.location.pathname.slice(0, -1)
          : window.location.pathname

      if (cleanPathname.toLowerCase() === '/consult') {
        returnPath.value = '/'
      } else {
        returnPath.value = currentFull || '/'
        if (options.syncUrl !== false) {
          window.history.replaceState({ ...window.history.state }, '', '/consult')
        }
      }
    }

    isOpen.value = true
  }

  const closeConsultModal = (options: { restoreUrl?: boolean } = {}) => {
    if (!isOpen.value) return
    isOpen.value = false

    if (import.meta.client && options.restoreUrl !== false) {
      const cleanPathname =
        window.location.pathname.length > 1 && window.location.pathname.endsWith('/')
          ? window.location.pathname.slice(0, -1)
          : window.location.pathname

      if (cleanPathname.toLowerCase() === '/consult') {
        const target = returnPath.value || '/'
        window.history.replaceState({ ...window.history.state }, '', target)
      }
    }
  }

  return {
    isOpen,
    initialPurpose,
    openConsultModal,
    closeConsultModal
  }
}