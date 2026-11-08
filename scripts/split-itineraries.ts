// scripts/split-itineraries.ts
import fs from 'node:fs'
import path from 'node:path'
import { ITINERARIES_DATABASE, type ItineraryFullRecord } from '../server/utils/itinerariesData'

const OUT_DIR = path.resolve(process.cwd(), 'server/data/itineraries')

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true })

// Build lookup map of all 45 valid slugs
const validSlugMap = new Map<string, ItineraryFullRecord>()
for (const entry of ITINERARIES_DATABASE) {
  if (entry?.meta?.slug) {
    validSlugMap.set(entry.meta.slug, entry)
  }
}

const allEntries = Array.from(validSlugMap.values())

// Helper: Pick 3 best-matching real related slugs when placeholders or duplicates exist
function resolveThreeRelatedSlugs(current: ItineraryFullRecord, index: number): [string, string, string] {
  const selfSlug = current.meta.slug
  const picked: string[] = []

  // 1. Keep any existing relatedSlugs that are real, unique, and not self
  if (Array.isArray(current.relatedSlugs)) {
    for (const candidate of current.relatedSlugs) {
      if (
        candidate &&
        candidate !== selfSlug &&
        validSlugMap.has(candidate) &&
        !picked.includes(candidate)
      ) {
        picked.push(candidate)
      }
    }
  }

  // 2. If fewer than 3 valid slugs, score remaining itineraries by thematic & regional affinity
  if (picked.length < 3) {
    const scored = allEntries
      .filter((item) => item.meta.slug !== selfSlug && !picked.includes(item.meta.slug))
      .map((candidate, cIdx) => {
        let score = 0
        // Shared categories (+3 each)
        for (const cat of current.meta.categories || []) {
          if (candidate.meta.categories?.includes(cat)) score += 3
        }
        // Same region (+2)
        if (
          candidate.meta.region &&
          current.meta.region &&
          candidate.meta.region.toLowerCase() === current.meta.region.toLowerCase()
        ) {
          score += 2
        }
        // Same tier (+1)
        if (candidate.meta.type === current.meta.type) {
          score += 1
        }
        // Deterministic rotation tie-breaker so recommendations distribute evenly across all 45
        const rotationBonus = ((cIdx + index * 7) % allEntries.length) * 0.01
        return { slug: candidate.meta.slug, total: score + rotationBonus }
      })
      .sort((a, b) => b.total - a.total)

    for (const match of scored) {
      if (picked.length >= 3) break
      picked.push(match.slug)
    }
  }

  return [
    picked[0] || selfSlug,
    picked[1] || selfSlug,
    picked[2] || selfSlug
  ]
}

let writtenCount = 0

allEntries.forEach((entry, idx) => {
  const cleanRecord: ItineraryFullRecord = {
    meta: entry.meta,
    relatedSlugs: resolveThreeRelatedSlugs(entry, idx),
    seo: entry.seo,
    header: entry.header,
    sidebar: entry.sidebar,
    sections: entry.sections
  }

  const filePath = path.join(OUT_DIR, `${entry.meta.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(cleanRecord, null, 2), 'utf-8')
  writtenCount++
})

console.log(`✅ Successfully unpacked ${writtenCount} itineraries into ${OUT_DIR}`)