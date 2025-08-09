import { memo, useCallback, useMemo } from 'react'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { useMovingEntityClassesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/MovingEntityClassesAsSelectOptionArray.store'
import { DialogFilterForm } from '../../../components/dialogs/DialogFilterForm'
import type { MovingEntityFilter } from '../../../models/entities-filters/MovingEntityFilter'
import { getMovingEntityFilterFields } from '../getMovingEntityFilterFields'

interface MovingEntityFilterDialogProps {
  filterValue?: MovingEntityFilter
  onSetFilterValue: (value: MovingEntityFilter | undefined) => void
  onHide: () => void
}
export const MovingEntityFilterDialog = memo(function MovingEntityFilterDialog({
  filterValue,
  onSetFilterValue,
  onHide,
}: MovingEntityFilterDialogProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useMovingEntityClassesAsSelectOptionArrayStore, useLocationsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const locationsAsSelectOptions = useLocationsAsSelectOptionArrayStore(state => state.items)
  const movingEntityClassesAsSelectOptions = useMovingEntityClassesAsSelectOptionArrayStore(state => state.items)
  const movingEntityFilterFields = useMemo(function movingEntityFilterFieldsMemo() {
    if (isLoading) {
      return getMovingEntityFilterFields([], [])
    }
    return getMovingEntityFilterFields(movingEntityClassesAsSelectOptions, locationsAsSelectOptions)
  }, [movingEntityClassesAsSelectOptions, locationsAsSelectOptions, isLoading])

  const handleHideFilterProductDialog = useCallback(function handleHideFilterProductDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfMovingEntityFilter = useCallback(function handleSetValueOfMovingEntityFilter(filterAttributes: MovingEntityFilter) {
    const filterValueAttributesNames = Object.keys(filterAttributes)

    if (!filterValueAttributesNames.length) {
      onSetFilterValue(undefined)
    } else {
      onSetFilterValue(filterAttributes)
    }

    handleHideFilterProductDialog()
  }, [handleHideFilterProductDialog, onSetFilterValue])

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      >
        <DialogFilterForm
          humanizedPluralItemTypeName="moving objects"
          filterValue={filterValue}
          formFields={movingEntityFilterFields}
          onCancel={handleHideFilterProductDialog}
          onFilter={handleSetValueOfMovingEntityFilter}
        />
      </div>
    </>
  )
})
