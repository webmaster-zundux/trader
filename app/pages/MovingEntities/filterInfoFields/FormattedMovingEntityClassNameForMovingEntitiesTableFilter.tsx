import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getMovingEntityClassByUuidSelector, useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedMovingEntityClassNameForMovingEntitiesTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([useMovingEntityClassesStore])

  if (!value) {
    return undefined
  }
  const movingEntityClassName = (isLoading || !isUuid(value)) ? undefined : getMovingEntityClassByUuidSelector(value)?.name

  if (!movingEntityClassName) {
    return {
      label: label ?? name?.toString(),
      value: `(moving object class without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: movingEntityClassName,
  }
}
