import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'

export function FormattedLocationNameForOrdersTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])

  if (!value) {
    return undefined
  }
  const locationWithFullName = (isLoading || !isUuid(value)) ? undefined : getLocationWithFullNameByUuidSelector(value)

  if (!locationWithFullName) {
    return {
      label: label ?? name?.toString(),
      value: `(location without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: locationWithFullName,
  }
}
