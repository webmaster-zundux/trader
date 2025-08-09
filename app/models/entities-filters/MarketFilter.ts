import type { Location } from '../entities/Location'
import type { PlanetarySystem } from '../entities/PlanetarySystem'

export type MarketFilter = {
  locationUuid?: Location['uuid'] | PlanetarySystem['uuid']

  minPrice?: number
  maxPrice?: number

  minQuantity?: number
  maxQuantity?: number
}
