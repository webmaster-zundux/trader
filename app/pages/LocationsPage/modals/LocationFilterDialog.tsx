import { memo, useCallback, useMemo } from 'react'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationTypesAsSelectOptionArray.store'
import { usePlanetarySystemsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/PlanetarySystemsAsSelectOptionArray.store'
import { DialogFilterForm } from '../../../components/dialogs/DialogFilterForm'
import type { LocationFilter } from '../../../models/entities-filters/LocationFilter'
import { getLocationFilterFields } from './getLocationsFilterFields'

interface LocationsFilterDialogProps {
  filterValue?: LocationFilter
  onSetFilterValue: (value: LocationFilter) => void
  onHide: () => void
}
export const LocationFilterDialog = memo(function LocationFilterDialog({
  filterValue,
  onSetFilterValue,
  onHide,
}: LocationsFilterDialogProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([usePlanetarySystemsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const planetarySystemsAsSelectOptions = usePlanetarySystemsAsSelectOptionArrayStore(state => state.items)
  const locationTypesAsSelectOptions = useLocationTypesAsSelectOptionArrayStore(state => state.items)
  const locationFilterFields = useMemo(function locationFilterFieldsMemo() {
    if (isLoading) {
      return getLocationFilterFields([], [])
    }

    return getLocationFilterFields(planetarySystemsAsSelectOptions, locationTypesAsSelectOptions)
  }, [planetarySystemsAsSelectOptions, isLoading, locationTypesAsSelectOptions])

  const handleHideFilterOrderDialog = useCallback(function handleHideFilterOrderDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfLocationsFilter = useCallback(function handleSetValueOfLocationsFilter(filterAttributes: LocationFilter) {
    onSetFilterValue(filterAttributes)
    handleHideFilterOrderDialog()
  }, [handleHideFilterOrderDialog, onSetFilterValue])

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      >
        <DialogFilterForm
          humanizedPluralItemTypeName="locations"
          filterValue={filterValue}
          formFields={locationFilterFields}
          onCancel={handleHideFilterOrderDialog}
          onFilter={handleSetValueOfLocationsFilter}
        />
      </div>
    </>
  )
})
