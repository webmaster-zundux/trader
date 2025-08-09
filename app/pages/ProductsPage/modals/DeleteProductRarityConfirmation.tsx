import { memo, useCallback, useMemo } from 'react'
import type { ProductRarity } from '../../../models/entities/ProductRarity'
import { useProductRaritiesStore } from '../../../stores/entity-stores/ProductRarities.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

interface DeleteProductRarityConfirmationProps {
  itemToDelete: ProductRarity
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteProductRarityConfirmation = memo(function DeleteProductRarityConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteProductRarityConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductRaritiesStore])
  const isLoading = isLoadingPersistStorages

  const deleteProductRarity = useProductRaritiesStore(state => state.delete)

  const handleHideDeleteProductRarityConfirmation = useCallback(function handleHideDeleteProductRarityConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditProductRarityModal = useCallback(function handleHideEditProductRarityModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteProductRarity = useCallback(function handleDeleteProductRarity() {
    if (isLoading) {
      return
    }

    deleteProductRarity(itemToDelete)
    handleHideDeleteProductRarityConfirmation()
    handleHideEditProductRarityModal()
  }, [deleteProductRarity, itemToDelete, handleHideDeleteProductRarityConfirmation, handleHideEditProductRarityModal, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        <br />
        the product rarity named
        {' '}
        <strong>{itemToDelete.name}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteProductRarityConfirmation}
      onConfirm={handleDeleteProductRarity}
      confirmButtonLabel="delete product rarity"
    />
  )
})
