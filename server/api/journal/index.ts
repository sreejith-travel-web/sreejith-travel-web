// ~/server/api/journal/index.ts
import { JOURNAL_DATABASE } from '../../utils/journalData'

export default defineEventHandler(async () => {
  return [...JOURNAL_DATABASE]
    .sort((a, b) => new Date(b.meta.publishDate).getTime() - new Date(a.meta.publishDate).getTime())
    .map((entry) => entry.meta)
})