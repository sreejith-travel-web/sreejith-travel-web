// ~/server/api/itineraries/index.ts
import { ITINERARIES_DATABASE } from '../../utils/itinerariesData'

export default defineEventHandler(async () => {
  // Split-Storage Collection: returns only the 6+ listing/featured meta fields
  return ITINERARIES_DATABASE.map((entry) => entry.meta)
})