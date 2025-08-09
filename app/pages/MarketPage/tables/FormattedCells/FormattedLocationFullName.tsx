import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'

export function FormattedLocationFullName({ value }: { value: unknown }) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const locationFullName = (isLoading || !isUuid(value)) ? undefined : getLocationWithFullNameByUuidSelector(value)

  if (!locationFullName) {
    return (
      <NoDataCell>
        (no&nbsp;data)
      </NoDataCell>
    )
  }

  return (
    <>
      {locationFullName}
    </>
  )
}
