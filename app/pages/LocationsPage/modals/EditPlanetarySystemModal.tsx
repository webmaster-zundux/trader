import { memo, useCallback } from 'react'
import { parsePositionFromString, positionToString } from '~/models/Position'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { PlanetarySystem } from '../../../models/entities/PlanetarySystem'
import { ENTITY_TYPE_PLANETARY_SYSTEM, PLANETARY_SYSTEM_ATTRIBUTES, PLANETARY_SYSTEM_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/PlanetarySystem'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getPlanetarySystemByNameCaseInsensetiveExceptItSelfSelector, getPlanetarySystemByPositionExceptItSelfSelector, usePlanetarySystemsStore } from '../../../stores/entity-stores/PlanetarySystems.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'

const formFields: FormField<PlanetarySystem>[] = [
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
    name: 'position',
  },
]

interface EditPlanetarySystemModalProps {
  itemToEdit?: PlanetarySystem | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: PlanetarySystem) => void
  onCreateItem?: (item: PlanetarySystem) => void
  onUpdateItem?: (item: PlanetarySystem) => void
}
export const EditPlanetarySystemModal = memo(function EditPlanetarySystemModal({
  itemToEdit,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditPlanetarySystemModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePlanetarySystemsStore])

  const isLoading = isLoadingPersistStorages

  const createPlanetarySystem = usePlanetarySystemsStore(state => state.create)
  const updatePlanetarySystem = usePlanetarySystemsStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<PlanetarySystem>) => {
    const newItem = createPlanetarySystem(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createPlanetarySystem, onCreateItem])

  const handleUpdateItem = useCallback((item: PlanetarySystem) => {
    const updatedItem = updatePlanetarySystem(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updatePlanetarySystem, onUpdateItem])

  const handleHideEditPlanetarySystemModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<PlanetarySystem> | PlanetarySystem
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes =
        getAttributesByWhiteList<WithoutUUID<PlanetarySystem>>(itemData, PLANETARY_SYSTEM_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_PLANETARY_SYSTEM
      dataAttributes.name = dataAttributes.name.toLocaleLowerCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<PlanetarySystem>(itemData, PLANETARY_SYSTEM_ATTRIBUTES)

      dataAttributes.name = dataAttributes.name.toLocaleLowerCase()
      const position = parsePositionFromString(dataAttributes.position)

      if (position) {
        dataAttributes.position = positionToString(position)
      }

      handleUpdateItem(dataAttributes)
    }

    handleHideEditPlanetarySystemModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditPlanetarySystemModal])

  const validatePlanetarySystemFormData = useCallback((itemData: PlanetarySystem): string | (() => React.JSX.Element) | undefined => {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingItemWithTheSameName = getPlanetarySystemByNameCaseInsensetiveExceptItSelfSelector(itemData)

    if (existingItemWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Planetary system
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

    const planetarySystemPosition = itemData.position

    if (!planetarySystemPosition) {
      return undefined
    }

    const existingItemWithTheSamePosition =
      getPlanetarySystemByPositionExceptItSelfSelector(itemData)

    if (existingItemWithTheSamePosition) {
      return function ErrorMessage() {
        return (
          <>
            Planetary system with position
            {' '}
            <strong>{existingItemWithTheSamePosition.position}</strong>
            {' '}
            (named
            {' '}
            <strong>{existingItemWithTheSamePosition.name}</strong>
            {' '}
            ) already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  return (
    <ModalEditForm
      humanizedItemTypeName="planetary system"
      itemToEdit={itemToEdit}
      formFields={formFields}
      validateFormData={validatePlanetarySystemFormData}
      onCancel={handleHideEditPlanetarySystemModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete planetary system"
    />
  )
})
