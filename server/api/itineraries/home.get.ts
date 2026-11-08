// ~~/server/api/itineraries/home.get.ts
import { defineEventHandler } from 'h3'
import { ITINERARIES_DATABASE, type ItineraryMeta } from '~~/server/utils/itinerariesData'

export interface HomeFeaturedItinerariesResponse {
  signature: ItineraryMeta[]
  collaborated: ItineraryMeta[]
}

export default defineEventHandler((): HomeFeaturedItinerariesResponse => {
  const signature: ItineraryMeta[] = []
  const collaborated: ItineraryMeta[] = []

  for (const entry of ITINERARIES_DATABASE) {
    const meta = entry.meta
    if (!meta?.featuredHome) continue

    if (meta.type === 'signature') {
      signature.push(meta)
    } else if (meta.type === 'collaborated') {
      collaborated.push(meta)
    }
  }

  return {
    signature,
    collaborated
  }
})