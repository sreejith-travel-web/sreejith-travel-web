// ~~/server/api/journal/[slug].get.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import {
  getJournalDatabase,
  type JournalMeta,
  type JournalSinglePayload
} from '~~/server/utils/journalData'

export default defineEventHandler((event): JournalSinglePayload => {
  const db = getJournalDatabase()
  const rawSlug = getRouterParam(event, 'slug')
  const slug = rawSlug?.toLowerCase().trim()

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid or missing journal slug'
    })
  }

  const found = db.find(
    (item) =>
      item.meta.slug.toLowerCase() === slug ||
      item.meta.id.toLowerCase() === slug
  )

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: `Journal story "${rawSlug}" not found`
    })
  }

  // 1. Same subcategory -> 2. Same top-level category -> 3. Remaining entries
  const sameSubcategory = db
    .filter(
      (item) =>
        item.meta.slug !== found.meta.slug &&
        item.meta.subcategory === found.meta.subcategory
    )
    .map((item) => item.meta)

  const sameCategory = db
    .filter(
      (item) =>
        item.meta.slug !== found.meta.slug &&
        item.meta.category === found.meta.category &&
        !sameSubcategory.some((s) => s.slug === item.meta.slug)
    )
    .map((item) => item.meta)

  const otherEntries = db
    .filter(
      (item) =>
        item.meta.slug !== found.meta.slug &&
        !sameSubcategory.some((s) => s.slug === item.meta.slug) &&
        !sameCategory.some((c) => c.slug === item.meta.slug)
    )
    .map((item) => item.meta)

  const related: JournalMeta[] = [...sameSubcategory, ...sameCategory, ...otherEntries].slice(0, 3)

  return {
    record: found,
    related
  }
})