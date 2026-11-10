// ~~/server/api/journal/home.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { getJournalDatabase, type JournalMeta } from '~~/server/utils/journalData'

export interface HomeFeaturedJournalResponse {
  featured: JournalMeta | null
  listing: JournalMeta[]
}

const cleanSlug = (raw: string): string =>
  raw
    .trim()
    .replace(/^\/journal\//i, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()

export default defineEventHandler((event): HomeFeaturedJournalResponse => {
  const db = getJournalDatabase()
  const query = getQuery(event)

  const hasExplicitConfig =
    query.featuredSlug !== undefined || query.listingSlugs !== undefined

  if (hasExplicitConfig) {
    const rawFeatured = typeof query.featuredSlug === 'string' ? cleanSlug(query.featuredSlug) : ''
    const featured = rawFeatured
      ? db.find((entry) => entry.meta.slug.toLowerCase() === rawFeatured)?.meta ?? null
      : null

    const rawListingParam = query.listingSlugs
    const rawSlugsList = Array.isArray(rawListingParam)
      ? rawListingParam.flatMap((s) => String(s).split(','))
      : typeof rawListingParam === 'string'
        ? rawListingParam.split(',')
        : []

    const uniqueListingSlugs = [...new Set(rawSlugsList.map(cleanSlug).filter(Boolean))].slice(0, 3)

    const listing: JournalMeta[] = uniqueListingSlugs
      .map((slug) => db.find((entry) => entry.meta.slug.toLowerCase() === slug)?.meta)
      .filter((item): item is JournalMeta => Boolean(item))
      .slice(0, 3)

    return {
      featured,
      listing
    }
  }

  // Fallback if endpoint is hit directly without query parameters
  return {
    featured: db[0]?.meta ?? null,
    listing: db.slice(1, 4).map((entry) => entry.meta)
  }
})