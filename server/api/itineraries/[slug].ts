// ~/server/api/itineraries/[slug].ts
import { ITINERARIES_DATABASE } from '../../utils/itinerariesData'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/i.test(slug)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid or missing itinerary slug'
    })
  }

  const found = ITINERARIES_DATABASE.find((item) => item.meta.slug === slug)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Itinerary not found'
    })
  }

  // Pick 3 related journeys sharing the same type or overlapping categories
  const related = ITINERARIES_DATABASE
    .filter((item) => item.meta.slug !== slug && item.meta.type === found.meta.type)
    .slice(0, 3)
    .map((item) => item.meta)

  return {
    ...found,
    related
  }
})