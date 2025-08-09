import { memo, useCallback, useMemo } from 'react'
import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteMovingEntityClassConfirmationProps {
  itemToDelete: MovingEntityClass
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteMovingEntityClassConfirmation = memo(function DeleteMovingEntityClassConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteMovingEntityClassConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore])
  const isLoading = isLoadingPersistStorages

  const deleteItem = useMovingEntityClassesStore(state => state.delete)

  const handleHideDeleteItemConfirmation = useCallback(function handleHideDeleteItemConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditItemModal = useCallback(function handleHideEditItemModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteItem = useCallback(function handleDeleteMovingEntity() {
    if (isLoading) {
      return
    }

    deleteItem(itemToDelete)
    handleHideDeleteItemConfirmation()
    handleHideEditItemModal()
  }, [itemToDelete, handleHideDeleteItemConfirmation, handleHideEditItemModal, deleteItem, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        {' '}
        the moving object class named
        <br />
        <strong>
          {itemToDelete.name}
        </strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteItemConfirmation}
      onConfirm={handleDeleteItem}
      confirmButtonLabel="delete moving object class"
    />
  )
})
