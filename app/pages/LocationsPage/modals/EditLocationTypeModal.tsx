import { memo, useCallback } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { LocationType } from '../../../models/entities/LocationType'
import { ENTITY_TYPE_LOCATION_TYPE, LOCATION_TYPE_ATTRIBUTES, LOCATION_TYPE_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/LocationType'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getLocationTypeByNameCaseInsensetiveExceptItSelfSelector, useLocationTypesStore } from '../../../stores/entity-stores/LocationTypes.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'

const formFields: FormField<LocationType>[] = [
  {
    name: 'uuid',
    type: 'hidden',
  },
  {
    name: 'entityType',
    type: 'hidden',
  },
  {
    name: 'name',
    required: true,
  },
  {
    name: 'image',
    type: 'file',
    accept: 'image/*',
  },
]

interface EditLocationTypeModalProps {
  itemToEdit?: LocationType | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: LocationType) => void
  onCreateItem?: (item: LocationType) => void
  onUpdateItem?: (item: LocationType) => void
}
export const EditLocationTypeModal = memo(function EditLocationTypeModal({
  itemToEdit,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditLocationTypeModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationTypesStore])
  const isLoading = isLoadingPersistStorages

  const createLocationType = useLocationTypesStore(state => state.create)
  const updateLocationType = useLocationTypesStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<LocationType>) => {
    const newItem = createLocationType(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createLocationType, onCreateItem])

  const handleUpdateItem = useCallback((item: LocationType) => {
    const updatedItem = updateLocationType(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateLocationType, onUpdateItem])

  const handleHideEditLocationTypeModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<LocationType> | LocationType
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<LocationType>>(itemData, LOCATION_TYPE_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_LOCATION_TYPE
      dataAttributes.name = dataAttributes.name.toLocaleLowerCase()

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<LocationType>(itemData, LOCATION_TYPE_ATTRIBUTES)

      dataAttributes.name = dataAttributes.name.toLocaleLowerCase()

      handleUpdateItem(dataAttributes)
    }

    handleHideEditLocationTypeModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditLocationTypeModal])

  const validateLocationTypeFormData = useCallback((itemData: LocationType): string | (() => React.JSX.Element) | undefined => {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingItemWithTheSameName = getLocationTypeByNameCaseInsensetiveExceptItSelfSelector(itemData)

    if (existingItemWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Location type named
            {' '}
            <strong>
              {existingItemWithTheSameName.name}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  return (
    <ModalEditForm
      humanizedItemTypeName="location type"
      itemToEdit={itemToEdit}
      formFields={formFields}
      validateFormData={validateLocationTypeFormData}
      onCancel={handleHideEditLocationTypeModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete location type"
    />
  )
})
