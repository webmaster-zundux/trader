import type { LocationType } from '../entities/LocationType'
import type { PlanetarySystem } from '../entities/PlanetarySystem'

export type LocationFilter = {
  planetarySystemUuid?: PlanetarySystem['uuid']

  locationTypeUuid?: LocationType['uuid']
}
