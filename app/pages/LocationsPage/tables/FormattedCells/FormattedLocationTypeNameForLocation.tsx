import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getLocationTypeByUuidSelector, useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedLocationTypeNameForLocation({
  value
}: {
  value: unknown
}) {
  const isLoading = useLoadingPersistStorages([useLocationTypesStore])

  const name = (isLoading || !isUuid(value))
    ? undefined
    : getLocationTypeByUuidSelector(value)?.name

  if (!name) {
    return (
      <NoDataCell>
        (no&nbsp;type)
      </NoDataCell>
    )
  }

  return (
    <>
      {name}
    </>
  )
}
