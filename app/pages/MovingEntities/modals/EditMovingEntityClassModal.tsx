import type React from 'react'
import { memo, useCallback, useMemo } from 'react'
import type { MovingEntityClassFilter } from '~/models/entities-filters/MovingEntityClassFilter'
import { ENTITY_TYPE_MOVING_ENTITY_CLASS, MOVING_ENTITY_CLASS_ATTRIBUTES, MOVING_ENTITY_CLASS_ATTRIBUTES_WITHOUT_UUID, type MovingEntityClass } from '~/models/entities/MovingEntityClass'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getMovingEntityClassByNameCaseInsensetiveExceptItSelfSelector, useMovingEntityClassesStore } from '../../../stores/entity-stores/MovingEntityClasses.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import { getEditMovingEntityClassFormFields } from './getEditMovingEntityClassFormFields'

interface EditMovingEntityClassModalProps {
  itemToEdit?: MovingEntityClass | undefined
  filterValue?: MovingEntityClassFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: MovingEntityClass) => void
  onCreateItem?: (item: MovingEntityClass) => void
  onUpdateItem?: (item: MovingEntityClass) => void
}
export const EditMovingEntityClassModal = memo(function EditMovingEntityClassModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditMovingEntityClassModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore])
  const isLoading = isLoadingPersistStorages

  const createMovingEntityClass = useMovingEntityClassesStore(state => state.create)
  const updateMovingEntityClass = useMovingEntityClassesStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<MovingEntityClass>) => {
    const newItem = createMovingEntityClass(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createMovingEntityClass, onCreateItem])

  const handleUpdateItem = useCallback((item: MovingEntityClass) => {
    const updatedItem = updateMovingEntityClass(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateMovingEntityClass, onUpdateItem])

  const handleHideEditModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<MovingEntityClass> | MovingEntityClass
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<MovingEntityClass>>(itemData, MOVING_ENTITY_CLASS_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_MOVING_ENTITY_CLASS

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<MovingEntityClass>(itemData, MOVING_ENTITY_CLASS_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditModal])

  const validateFormData = useCallback((MovingEntityClass: MovingEntityClass): string | (() => React.JSX.Element) | undefined => {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingItemWithTheSameName = getMovingEntityClassByNameCaseInsensetiveExceptItSelfSelector(MovingEntityClass)

    if (existingItemWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Moving object class named
            {' '}
            <strong>
              {existingItemWithTheSameName ? existingItemWithTheSameName.name : '(moving object class without name)'}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  const movingEntityClassFormFields = useMemo(function formFieldsMemo() {
    return getEditMovingEntityClassFormFields()
  }, [])

  const movingEntityClassFormFieldsWithOptionalDefaultValues: FormField<MovingEntityClass>[]
    = useFilterValuesAsDefaultValuesInFormFields<MovingEntityClassFilter, MovingEntityClass>(movingEntityClassFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="moving object class"
      itemToEdit={itemToEdit}
      formFields={movingEntityClassFormFieldsWithOptionalDefaultValues}
      validateFormData={validateFormData}
      onCancel={handleHideEditModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete moving object class"
    />
  )
})
