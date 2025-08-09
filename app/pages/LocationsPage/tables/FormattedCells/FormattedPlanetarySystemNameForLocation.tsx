import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedPlanetarySystemNameForLocation({
  value
}: {
  value: unknown
}) {
  const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore])

  const planetarySystemName = (isLoading || !isUuid(value))
    ? undefined
    : getPlanetarySystemByUuidSelector(value)?.name

  if (!planetarySystemName) {
    return (
      <NoDataCell>
        (no&nbsp;data)
      </NoDataCell>
    )
  }

  return (
    <>
      {planetarySystemName}
    </>
  )
}
