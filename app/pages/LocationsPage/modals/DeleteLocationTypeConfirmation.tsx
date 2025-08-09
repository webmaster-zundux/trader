import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { LocationType } from '../../../models/entities/LocationType'
import { useLocationTypesStore } from '../../../stores/entity-stores/LocationTypes.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteLocationTypeConfirmationProps {
  itemToDelete: LocationType
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteLocationTypeConfirmation = memo(function DeleteLocationTypeConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteLocationTypeConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationTypesStore])
  const isLoading = isLoadingPersistStorages

  const deleteLocationType = useLocationTypesStore(state => state.delete)

  const handleHideDeleteLocationTypeConfirmation = useCallback(function handleHideDeleteLocationTypeConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditLocationTypeModal = useCallback(function handleHideEditLocationTypeModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteLocationType = useCallback(function handleDeleteLocationType() {
    if (isLoading) {
      return
    }

    deleteLocationType(itemToDelete)

    handleHideDeleteLocationTypeConfirmation()
    handleHideEditLocationTypeModal()
  }, [deleteLocationType, itemToDelete, handleHideDeleteLocationTypeConfirmation, handleHideEditLocationTypeModal, isLoading])

  const confirmationTitle = useMemo(() => {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        <br />
        the location type named
        {' '}
        <strong>{itemToDelete.name}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteLocationTypeConfirmation}
      onConfirm={handleDeleteLocationType}
      confirmButtonLabel="delete location type"
    />
  )
})
