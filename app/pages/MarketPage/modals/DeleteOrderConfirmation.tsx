import { memo, useCallback, useMemo } from 'react'
import type { Order } from '~/models/Order'
import { isBuyOrder } from '~/models/entities/BuyOrder'
import { isSellOrder } from '~/models/entities/SellOrder'
import { useBuyOrdersStore } from '~/stores/entity-stores/BuyOrders.store'
import { deleteOrderAction } from '~/stores/entity-stores/Orders.store'
import { deletePriceHistoryByOrderUuidAction, usePriceHistoriesStore } from '~/stores/entity-stores/PriceHistories.store'
import { useSellOrdersStore } from '~/stores/entity-stores/SellOrders.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { useLocationsStore } from '../../../stores/entity-stores/Locations.store'
import { getProductByUuidSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeleteOrderConfirmationProps {
  itemToDelete: Order
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteOrderConfirmation = memo(function DeleteOrderConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteOrderConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, useProductsStore, usePriceHistoriesStore, useSellOrdersStore, useBuyOrdersStore])
  const isLoadingCache = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingCache

  const humanizedOrderType = useMemo(function humanizedOrderTypeMemo() {
    return isSellOrder(itemToDelete) ? 'sell' : (isBuyOrder(itemToDelete) ? 'buy' : '')
  }, [itemToDelete])

  const handleHideDeleteOrderConfirmation = useCallback(function handleHideDeleteOrderConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditOrderModal = useCallback(function handleHideEditOrderModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteOrder = useCallback(function handleDeleteOrder() {
    if (isLoading) {
      return
    }

    deleteOrderAction(itemToDelete)
    deletePriceHistoryByOrderUuidAction(itemToDelete.uuid)

    handleHideDeleteOrderConfirmation()
    handleHideEditOrderModal()
  }, [itemToDelete, handleHideDeleteOrderConfirmation, handleHideEditOrderModal, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    const productName = (!isLoading && getProductByUuidSelector(itemToDelete.productUuid)?.name) || '(product without name)'
    const locationFullName = (!isLoading && getLocationWithFullNameByUuidSelector(itemToDelete.locationUuid)) || '(location without name)'

    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        {' '}
        the
        {' '}
        {humanizedOrderType}
        {' '}
        order
        <br />
        for
        {' '}
        <strong>{productName}</strong>
        <br />
        in
        {' '}
        <strong>{locationFullName}</strong>

        ?
      </>
    )
  }, [itemToDelete, isLoading, humanizedOrderType])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteOrderConfirmation}
      onConfirm={handleDeleteOrder}
      confirmButtonLabel={`delete ${humanizedOrderType} order`}
    />
  )
})
