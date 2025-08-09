import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getMovingEntityClassByUuidSelector, useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedMovingEntityClassForMovingEntity({ value }: { value: unknown }) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore])
  const isLoading = isLoadingPersistStorages

  const movingEntityClassName = (isLoading || !isUuid(value)) ? undefined : getMovingEntityClassByUuidSelector(value)?.name

  return (
    <>
      {movingEntityClassName
        ? movingEntityClassName
        : (
            <NoDataCell>
              (n/d)
            </NoDataCell>
          )}
    </>
  )
}
