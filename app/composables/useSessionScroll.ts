// ~/app/composables/useSessionScroll.ts
import type { ItineraryCategoryId } from '~~/server/utils/itinerariesData'
import type { ItineraryTabFilter } from '~/components/ItineraryListing.vue'
import type {
  JournalCategoryType,
  JournalSubcategoryId
} from '~~/server/utils/journalData'

export interface SavedItinerariesArchiveState {
  activeTab: ItineraryTabFilter
  selectedCategories: ItineraryCategoryId[]
  aliasPath: string
}

export interface SavedJournalArchiveState {
  activeTab: JournalCategoryType
  selectedSubcategories: JournalSubcategoryId[]
  aliasPath: string
}

export interface SavedImpactArchiveState {
  activeTab: string
  aliasPath: string
}

// Client-only in-memory stores (wiped automatically on F5 / full browser reload)
const scrollLedger = new Map<string, number>()
let activeRouteAlias: string | null = null
let savedItinerariesArchive: SavedItinerariesArchiveState | null = null
let savedJournalArchive: SavedJournalArchiveState | null = null
let savedImpactArchive: SavedImpactArchiveState | null = null

export const normalizeScrollKey = (rawPath?: string | null): string => {
  if (!rawPath) return '/'
  const clean = rawPath.split(/[?#]/)[0] || '/'
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1).toLowerCase()
  }
  return clean.toLowerCase()
}

export function useSessionScroll() {
  const saveScrollPosition = (rawPath: string, y: number) => {
    if (!import.meta.client) return
    const key = normalizeScrollKey(rawPath)
    scrollLedger.set(key, Math.max(0, Math.round(y)))
  }

  const getSavedScrollPosition = (rawPath: string): number | undefined => {
    if (!import.meta.client) return undefined
    return scrollLedger.get(normalizeScrollKey(rawPath))
  }

  const hasSavedScrollPosition = (rawPath: string): boolean => {
    if (!import.meta.client) return false
    return scrollLedger.has(normalizeScrollKey(rawPath))
  }

  const setActiveRouteAlias = (aliasPath: string | null) => {
    if (!import.meta.client) return
    activeRouteAlias = aliasPath ? normalizeScrollKey(aliasPath) : null
  }

  const getActiveRouteAlias = (): string | null => {
    if (!import.meta.client) return null
    return activeRouteAlias
  }

  const saveItinerariesArchiveState = (state: SavedItinerariesArchiveState) => {
    if (!import.meta.client) return
    savedItinerariesArchive = {
      activeTab: state.activeTab,
      selectedCategories: [...state.selectedCategories],
      aliasPath: state.aliasPath
    }
  }

  const getItinerariesArchiveState = (): SavedItinerariesArchiveState | null =>
    import.meta.client ? savedItinerariesArchive : null

  const saveJournalArchiveState = (state: SavedJournalArchiveState) => {
    if (!import.meta.client) return
    savedJournalArchive = {
      activeTab: state.activeTab,
      selectedSubcategories: [...state.selectedSubcategories],
      aliasPath: state.aliasPath
    }
  }

  const getJournalArchiveState = (): SavedJournalArchiveState | null =>
    import.meta.client ? savedJournalArchive : null

  const saveImpactArchiveState = (state: SavedImpactArchiveState) => {
    if (!import.meta.client) return
    savedImpactArchive = {
      activeTab: state.activeTab,
      aliasPath: state.aliasPath
    }
  }

  const getImpactArchiveState = (): SavedImpactArchiveState | null =>
    import.meta.client ? savedImpactArchive : null

  return {
    normalizeScrollKey,
    saveScrollPosition,
    getSavedScrollPosition,
    hasSavedScrollPosition,
    setActiveRouteAlias,
    getActiveRouteAlias,
    saveItinerariesArchiveState,
    getItinerariesArchiveState,
    saveJournalArchiveState,
    getJournalArchiveState,
    saveImpactArchiveState,
    getImpactArchiveState
  }
}