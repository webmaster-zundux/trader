import type { MarketFilter } from '~/models/entities-filters/MarketFilter'
import type { BuyOrder } from '~/models/entities/BuyOrder'
import type { SellOrder } from '~/models/entities/SellOrder'
import { getLocationByUuidSelector } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'

export function marketFilterLocationUuidPredicate(
  item: SellOrder | BuyOrder,
  filterValue: MarketFilter
): boolean {
  if (!filterValue.locationUuid) {
    return false
  }

  const isExactLocation = item.locationUuid === filterValue.locationUuid

  if (isExactLocation) {
    return true
  }

  const planetarySystemUuid = getLocationByUuidSelector(item.locationUuid)?.planetarySystemUuid
  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined

  if (!planetarySystem) {
    return false
  }

  return planetarySystem.uuid === filterValue.locationUuid
}
