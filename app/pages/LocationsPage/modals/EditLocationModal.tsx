import type React from 'react'
import { memo, useCallback, useMemo } from 'react'
import { parsePositionFromString, positionToString } from '~/models/Position'
import type { LocationFilter } from '~/models/entities-filters/LocationFilter'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationTypesAsSelectOptionArray.store'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { usePlanetarySystemsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/PlanetarySystemsAsSelectOptionArray.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import { ENTITY_TYPE_LOCATION, LOCATION_ATTRIBUTES, LOCATION_ATTRIBUTES_WITHOUT_UUID, type Location } from '../../../models/entities/Location'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getLocationByIdCaseInsensetiveExceptItSelfSelector, useLocationsStore } from '../../../stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '../../../stores/entity-stores/PlanetarySystems.store'
import { getEditLocationFormFields } from './getEditLocationFormFields'

interface EditLocationModalProps {
  itemToEdit?: Location | undefined
  filterValue?: LocationFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: Location) => void
  onCreateItem?: (item: Location) => void
  onUpdateItem?: (item: Location) => void
}
export const EditLocationModal = memo(function EditLocationModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditLocationModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([usePlanetarySystemsAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const createLocation = useLocationsStore(state => state.create)
  const updateLocation = useLocationsStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<Location>) => {
    const newItem = createLocation(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createLocation, onCreateItem])

  const handleUpdateItem = useCallback((item: Location) => {
    const updatedItem = updateLocation(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateLocation, onUpdateItem])

  const handleHideEditModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<Location> | Location
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<Location>>(itemData, LOCATION_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_LOCATION
      dataAttributes.id = dataAttributes.id?.toLocaleUpperCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<Location>(itemData, LOCATION_ATTRIBUTES)

      dataAttributes.id = dataAttributes.id?.toLocaleUpperCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleUpdateItem(dataAttributes)
    }

    handleHideEditModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditModal])

  const validateFormData = useCallback(function validateLocationFormData(
    location: Location
  ): string | (() => React.JSX.Element) | undefined {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const locationId = location.id

    if (locationId) {
      const existingLocationWithTheSameId = getLocationByIdCaseInsensetiveExceptItSelfSelector(location)

      if (existingLocationWithTheSameId) {
        const locationFullName = getLocationWithFullNameByUuidSelector(existingLocationWithTheSameId.uuid)

        return function ErrorMessage() {
          return (
            <>
              Location with Id:
              {' '}
              <strong>
                {locationId}
              </strong>
              {' '}
              (
              {locationFullName}
              )
              {' '}
              already exists
            </>
          )
        }
      }
    }

    if (location.position) {
      const locationPosition = parsePositionFromString(location.position)

      if (!locationPosition) {
        return function ErrorMessage() {
          return (
            <>
              Position coordinates have incorrect data.
              {' '}
              <br />
              Example:
              {' '}
              <strong>[ +100, -100, 0 ]</strong>
              {' '}
              or
              {' '}
              <strong>100,-100,0</strong>
            </>
          )
        }
      }
    }

    return undefined
  }, [isLoading])

  const planetarySystemsAsSelectOptions = usePlanetarySystemsAsSelectOptionArrayStore(state => state.items)
  const locationTypesAsSelectOptions = useLocationTypesAsSelectOptionArrayStore(state => state.items)

  const locationFormFields = useMemo(function locationFormFieldsMemo() {
    if (isLoading) {
      return getEditLocationFormFields([], [])
    }

    return getEditLocationFormFields(planetarySystemsAsSelectOptions, locationTypesAsSelectOptions)
  }, [planetarySystemsAsSelectOptions, locationTypesAsSelectOptions, isLoading])

  const locationFormFieldsWithOptionalDefaultValues: FormField<Location>[] =
    useFilterValuesAsDefaultValuesInFormFields<LocationFilter, Location>(locationFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="location"
      itemToEdit={itemToEdit}
      formFields={locationFormFieldsWithOptionalDefaultValues}
      validateFormData={validateFormData}
      onCancel={handleHideEditModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete location"
    />
  )
})
