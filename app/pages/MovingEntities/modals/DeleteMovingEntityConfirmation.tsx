import { memo, useCallback, useMemo } from 'react'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useMovingEntitiesStore } from '../../../stores/entity-stores/MovingEntities.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteMovingEntityConfirmationProps {
  itemToDelete: MovingEntity
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteMovingEntityConfirmation = memo(function DeleteMovingEntityConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteMovingEntityConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntitiesStore])
  const isLoading = isLoadingPersistStorages

  const deleteMovingEntity = useMovingEntitiesStore(state => state.delete)

  const handleHideDeleteMovingEntityConfirmation = useCallback(function handleHideDeleteMovingEntityConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditMovingEntityModal = useCallback(function handleHideEditMovingEntityModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteMovingEntity = useCallback(function handleDeleteMovingEntity() {
    if (isLoading) {
      return
    }

    deleteMovingEntity(itemToDelete)
    handleHideDeleteMovingEntityConfirmation()
    handleHideEditMovingEntityModal()
  }, [itemToDelete, handleHideDeleteMovingEntityConfirmation, handleHideEditMovingEntityModal, deleteMovingEntity, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        {' '}
        the moving object named
        <br />
        <strong>
          {itemToDelete.id ? `${itemToDelete.id}${' '}` : ``}
          {itemToDelete.name}
        </strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteMovingEntityConfirmation}
      onConfirm={handleDeleteMovingEntity}
      confirmButtonLabel="delete moving object"
    />
  )
})
