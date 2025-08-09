import type React from 'react'
import { memo, useCallback, useMemo } from 'react'
import type { MovingEntityFilter } from '~/models/entities-filters/MovingEntityFilter'
import { ENTITY_TYPE_MOVING_ENTITY, MOVING_ENTITY_ATTRIBUTES, MOVING_ENTITY_ATTRIBUTES_WITHOUT_UUID, type MovingEntity } from '~/models/entities/MovingEntity'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { useMovingEntityClassesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/MovingEntityClassesAsSelectOptionArray.store'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getMovingEntityByIdCaseInsensetiveExceptItSelfSelector, getMovingEntityByOriginalIdCaseInsensetiveExceptItSelfSelector, useMovingEntitiesStore } from '../../../stores/entity-stores/MovingEntities.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import { getEditMovingEntityFormFields } from './getEditMovingEntityFormFields'
import { parsePositionFromString, positionToString } from '~/models/Position'

interface EditMovingEntityModalProps {
  itemToEdit?: MovingEntity | undefined
  filterValue?: MovingEntityFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: MovingEntity) => void
  onCreateItem?: (item: MovingEntity) => void
  onUpdateItem?: (item: MovingEntity) => void
}
export const EditMovingEntityModal = memo(function EditMovingEntityModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditMovingEntityModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntitiesStore, useMovingEntityClassesStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useMovingEntityClassesAsSelectOptionArrayStore, useLocationsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const createMovingEntity = useMovingEntitiesStore(state => state.create)
  const updateMovingEntity = useMovingEntitiesStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<MovingEntity>) => {
    const newItem = createMovingEntity(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createMovingEntity, onCreateItem])

  const handleUpdateItem = useCallback((item: MovingEntity) => {
    const updatedItem = updateMovingEntity(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateMovingEntity, onUpdateItem])

  const handleHideEditModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<MovingEntity> | MovingEntity
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<MovingEntity>>(itemData, MOVING_ENTITY_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_MOVING_ENTITY
      dataAttributes.id = dataAttributes.id?.toLocaleUpperCase()
      dataAttributes.originalId = dataAttributes.originalId?.toLocaleUpperCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<MovingEntity>(itemData, MOVING_ENTITY_ATTRIBUTES)

      dataAttributes.id = dataAttributes.id?.toLocaleUpperCase()
      dataAttributes.originalId = dataAttributes.originalId?.toLocaleUpperCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleUpdateItem(dataAttributes)
    }

    handleHideEditModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditModal])

  const validateFormData = useCallback((movingEntity: MovingEntity): string | (() => React.JSX.Element) | undefined => {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingItemWithTheSameId = getMovingEntityByIdCaseInsensetiveExceptItSelfSelector(movingEntity)

    if (existingItemWithTheSameId) {
      return function ErrorMessage() {
        return (
          <>
            Moving object with Id:
            {' '}
            <strong>
              {existingItemWithTheSameId ? existingItemWithTheSameId.id : '(no-id)'}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    const existingItemWithTheSameOriginalId = getMovingEntityByOriginalIdCaseInsensetiveExceptItSelfSelector(movingEntity)

    if (existingItemWithTheSameOriginalId) {
      return function ErrorMessage() {
        return (
          <>
            Moving object with Original Id:
            {' '}
            <strong>
              {existingItemWithTheSameOriginalId ? existingItemWithTheSameOriginalId.originalId : '(no-original-id)'}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  const movingEntityClassesAsSelectOptions = useMovingEntityClassesAsSelectOptionArrayStore(state => state.items)
  const locationsAsSelectOptions = useLocationsAsSelectOptionArrayStore(state => state.items)

  const movingEntityFormFields = useMemo(function formFieldsMemo() {
    if (isLoading) {
      return getEditMovingEntityFormFields({
        locationsAsSelectOptions: [],
        movingEntityClassesAsSelectOptions: []
      })
    }
    return getEditMovingEntityFormFields({
      locationsAsSelectOptions,
      movingEntityClassesAsSelectOptions,
    })
  }, [movingEntityClassesAsSelectOptions, locationsAsSelectOptions, isLoading])

  const movingEntityFormFieldsWithOptionalDefaultValues: FormField<MovingEntity>[]
    = useFilterValuesAsDefaultValuesInFormFields<MovingEntityFilter, MovingEntity>(movingEntityFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="moving object"
      itemToEdit={itemToEdit}
      formFields={movingEntityFormFieldsWithOptionalDefaultValues}
      validateFormData={validateFormData}
      onCancel={handleHideEditModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete moving object"
    />
  )
})
