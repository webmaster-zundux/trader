import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { Product } from '../../../models/entities/Product'
import { useProductsStore } from '../../../stores/entity-stores/Products.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteProductConfirmationProps {
  itemToDelete: Product
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteProductConfirmation = memo(function DeleteProductConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteProductConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductsStore])
  const isLoading = isLoadingPersistStorages

  const deleteProduct = useProductsStore(state => state.delete)

  const handleHideDeleteProductConfirmation = useCallback(function handleHideDeleteProductConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditProductModal = useCallback(function handleHideEditProductModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteProduct = useCallback(function handleDeleteProduct() {
    if (isLoading) {
      return
    }

    deleteProduct(itemToDelete)
    handleHideDeleteProductConfirmation()
    handleHideEditProductModal()
  }, [itemToDelete, handleHideDeleteProductConfirmation, handleHideEditProductModal, deleteProduct, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        <br />
        the product named
        {' '}
        <strong>{itemToDelete.name}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteProductConfirmation}
      onConfirm={handleDeleteProduct}
      confirmButtonLabel="delete product"
    />
  )
})
