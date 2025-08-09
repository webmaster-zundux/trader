import type { Location } from '~/models/entities/Location'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getLocationByUuidSelector } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'

export function movingEntitiesTableFilterPredicate(
  itemLocationUuid: Location['uuid'] | PlanetarySystem['uuid'] | undefined,
  filterLocationUuid: Location['uuid'] | PlanetarySystem['uuid'] | undefined
): boolean {
  if (!itemLocationUuid || !filterLocationUuid) {
    return false
  }

  const isExactLocation = itemLocationUuid === filterLocationUuid

  if (isExactLocation) {
    return true
  }

  const planetarySystemUuid = getLocationByUuidSelector(itemLocationUuid)?.planetarySystemUuid
  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined

  if (!planetarySystem) {
    return false
  }

  return planetarySystem.uuid === filterLocationUuid
}
