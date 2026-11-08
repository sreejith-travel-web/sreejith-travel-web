// ~~/server/api/itineraries/index.get.ts
import { defineEventHandler } from 'h3'
import { ITINERARIES_DATABASE, type ItineraryMeta } from '~~/server/utils/itinerariesData'

export default defineEventHandler((): ItineraryMeta[] => {
  return ITINERARIES_DATABASE.map((entry) => entry.meta)
})