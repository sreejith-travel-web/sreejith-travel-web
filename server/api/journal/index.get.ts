// ~~/server/api/journal/index.get.ts
import { defineEventHandler } from 'h3'
import { getJournalDatabase, type JournalMeta } from '~~/server/utils/journalData'

export default defineEventHandler((): JournalMeta[] => {
  const db = getJournalDatabase()
  return [...db]
    .sort(
      (a, b) =>
        new Date(b.meta.publishDate).getTime() - new Date(a.meta.publishDate).getTime()
    )
    .map((entry) => entry.meta)
})