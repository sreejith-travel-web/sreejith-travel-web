// ~~/server/api/itineraries/[slug].get.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import {
  ITINERARIES_DATABASE,
  type ItineraryMeta,
  type ItinerarySinglePayload
} from '~~/server/utils/itinerariesData'

export default defineEventHandler((event): ItinerarySinglePayload => {
  const rawSlug = getRouterParam(event, 'slug')
  const target = rawSlug?.toLowerCase().trim()

  if (!target) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing itinerary slug'
    })
  }

  const found = ITINERARIES_DATABASE.find(
    (entry) =>
      entry.meta.slug.toLowerCase() === target ||
      entry.meta.id.toLowerCase() === target
  )

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: `Itinerary "${rawSlug}" not found`
    })
  }

  // Resolve the 3 curated relatedSlugs into lightweight ItineraryMeta card objects on the server
  const matched = (found.relatedSlugs || [])
    .map(
      (s) =>
        ITINERARIES_DATABASE.find(
          (entry) => entry.meta.slug === s || entry.meta.id === s
        )?.meta
    )
    .filter(
      (item): item is ItineraryMeta =>
        Boolean(item && item.slug !== found.meta.slug)
    )

  const fallbackPool = ITINERARIES_DATABASE.filter(
    (entry) =>
      entry.meta.slug !== found.meta.slug &&
      !matched.some((m) => m.slug === entry.meta.slug)
  ).map((e) => e.meta)

  const relatedItems = [...matched, ...fallbackPool].slice(0, 3)

  return {
    ...found,
    relatedItems
  }
})