import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedLocationNameForMovingEntitiesTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])

  if (!value) {
    return undefined
  }
  const locationUuid = (isLoading || !isUuid(value)) ? undefined : value
  const location = locationUuid ? getLocationByUuidSelector(locationUuid) : undefined

  if (location) {
    return {
      label: label ?? name?.toString(),
      value: location?.name,
    }
  }

  const planetarySystemUuid = (isLoading || !isUuid(value)) ? undefined : value
  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined

  if (planetarySystem) {
    return {
      label: label ?? name?.toString(),
      value: planetarySystem?.name
    }
  }

  return {
    label: label ?? name?.toString(),
    value: `(location type without name)`,
  }
}
