import { isUuid } from '~/models/Entity'
import { getPlanetarySystemByUuidSelector, getPlanetarySystemsSelector } from '~/stores/entity-stores/PlanetarySystems.store'

export function sortItemsByPlanetarySystemName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const { isHydrating: isLoading } = getPlanetarySystemsSelector()

  if (isLoading) {
    return 0
  }

  const planetarySystemNameA = (isUuid(aItemUuid) && getPlanetarySystemByUuidSelector(aItemUuid)?.name) || ''
  const planetarySystemNameB = (isUuid(bItemUuid) && getPlanetarySystemByUuidSelector(bItemUuid)?.name) || ''

  return planetarySystemNameA.localeCompare(planetarySystemNameB)
}
