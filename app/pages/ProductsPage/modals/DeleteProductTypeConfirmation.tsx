import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { ProductType } from '../../../models/entities/ProductType'
import { useProductTypesStore } from '../../../stores/entity-stores/ProductTypes.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteProductTypeConfirmationProps {
  itemToDelete: ProductType
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteProductTypeConfirmation = memo(function DeleteProductTypeConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteProductTypeConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore])
  const isLoading = isLoadingPersistStorages

  const deleteProductType = useProductTypesStore(state => state.delete)

  const handleHideDeleteProductTypeConfirmation = useCallback(function handleHideDeleteProductTypeConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditProductTypeModal = useCallback(function handleHideEditProductTypeModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteProductType = useCallback(function handleDeleteProductType() {
    if (isLoading) {
      return
    }

    deleteProductType(itemToDelete)
    handleHideDeleteProductTypeConfirmation()
    handleHideEditProductTypeModal()
  }, [itemToDelete, handleHideDeleteProductTypeConfirmation, handleHideEditProductTypeModal, deleteProductType, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        <br />
        the product type named
        {' '}
        <strong>{itemToDelete.name}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteProductTypeConfirmation}
      onConfirm={handleDeleteProductType}
      confirmButtonLabel="delete product type"
    />
  )
})
