import { memo, useCallback, useMemo } from 'react'
import type { Order } from '~/models/Order'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { getProductByUuidSelector, useProductsStore } from '~/stores/entity-stores/Products.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { ENTITY_TYPE_BUY_ORDER } from '../../../models/entities/BuyOrder'
import { ENTITY_TYPE_SELL_ORDER } from '../../../models/entities/SellOrder'
import { deletePriceHistoryByOrderUuidAction, usePriceHistoriesStore } from '../../../stores/entity-stores/PriceHistories.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeletePriceHistoryConfirmationProps {
  order: Order
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeletePriceHistoryConfirmation = memo(function DeletePriceHistoryConfirmation({
  order,
  onHideModal,
  onHideParentModal,
}: DeletePriceHistoryConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePriceHistoriesStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingCache = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingCache

  const handleHideDeletePriceHistoryConfirmation = useCallback(function handleHideDeletePriceHistoryConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleDelete = useCallback(function handleDelete() {
    deletePriceHistoryByOrderUuidAction(order.uuid)

    handleHideDeletePriceHistoryConfirmation()
    onHideParentModal()
  }, [order, handleHideDeletePriceHistoryConfirmation, onHideParentModal])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    const productName = (!isLoading && getProductByUuidSelector(order.productUuid)?.name) || '(product without name)'
    const locationFullName = (!isLoading && getLocationWithFullNameByUuidSelector(order.locationUuid)) || '(location without name)'

    let orderEntityTypeName = ''

    if (order.entityType === ENTITY_TYPE_SELL_ORDER) {
      orderEntityTypeName = 'sell'
    } else if (order.entityType === ENTITY_TYPE_BUY_ORDER) {
      orderEntityTypeName = 'buy'
    }

    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        {' '}
        <strong>price history</strong>
        <br />
        of the
        {' '}
        {orderEntityTypeName}
        {' '}
        order for
        {' '}
        <strong>{productName}</strong>
        <br />
        in
        {' '}
        <strong>{locationFullName}</strong>
        {' '}
        ?
      </>
    )
  }, [order, isLoading])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeletePriceHistoryConfirmation}
      onConfirm={handleDelete}
      confirmButtonLabel="delete price history"
    />
  )
})
