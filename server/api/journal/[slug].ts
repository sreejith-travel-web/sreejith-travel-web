// ~/server/api/journal/[slug].ts
import { JOURNAL_DATABASE } from '../../utils/journalData'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/i.test(slug)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid or missing journal slug'
    })
  }

  const found = JOURNAL_DATABASE.find((item) => item.meta.slug === slug)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Story not found'
    })
  }

  const related = JOURNAL_DATABASE
    .filter((item) => item.meta.slug !== slug && item.meta.type === found.meta.type)
    .slice(0, 3)
    .map((item) => item.meta)

  return {
    record: found,
    related
  }
})