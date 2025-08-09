import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getLocationTypeByUuidSelector, useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedLocationTypeNameForLocationsTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([useLocationTypesStore])

  if (!value) {
    return undefined
  }
  const locationTypeName = (isLoading || !isUuid(value)) ? undefined : getLocationTypeByUuidSelector(value)?.name

  if (!locationTypeName) {
    return {
      label: label ?? name?.toString(),
      value: `(location type without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: locationTypeName,
  }
}
