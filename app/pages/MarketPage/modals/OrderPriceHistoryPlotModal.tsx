import { memo, useCallback, useMemo } from 'react'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { getPriceHistoryByOrderUuidSelector, hasEnoughDataForPriceHistoryPlot } from '~/stores/entity-stores/PriceHistories.store'
import { getProductByUuidSelector, useProductsStore } from '~/stores/entity-stores/Products.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/modals/Modal'
import type { Order } from '../../../models/Order'
import { ORDER_PRICE_HISTORY_RECORDS_MAX_LIMIT, usePriceHistoriesStore } from '../../../stores/entity-stores/PriceHistories.store'
import { PriceLinePlot } from '../plots/PriceLinePlot'
import { DeletePriceHistoryConfirmation } from './DeletePriceHistoryConfirmation'
import styles from './OrderPriceHistoryPlotModal.module.css'

interface OrderPricePlotModalTitleProps {
  formTitle: string
  hasEnoughDataForPlot: boolean
  handleShowDeletePriceAtMarksConfirmation: () => void
  deleteItemButtonLabel: string
}
const OrderPricePlotModalTitle = memo(function OrderPricePlotModalTitle({
  formTitle,
  hasEnoughDataForPlot,
  handleShowDeletePriceAtMarksConfirmation,
  deleteItemButtonLabel,
}: OrderPricePlotModalTitleProps) {
  return (
    <div className={styles.TitleWithButton}>
      {formTitle}

      {hasEnoughDataForPlot && (
        <Button
          size="small"
          noPadding
          transparent
          onClick={handleShowDeletePriceAtMarksConfirmation}
          title={deleteItemButtonLabel}
        >
          <i className="icon icon-delete_forever"></i>
        </Button>
      )}
    </div>
  )
})

interface OrderPriceHistoryPlotModalProps {
  order: Order
  onHideModal: () => void
  deleteItemButtonLabel?: string
}
export const OrderPriceHistoryPlotModal = memo(function OrderPriceHistoryPlotModal({
  order,
  deleteItemButtonLabel = 'delete price records',
  onHideModal,
}: OrderPriceHistoryPlotModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePriceHistoriesStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingCache = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingCache

  const orderPriceHistory = useMemo(function orderPriceHistoryMemo() {
    if (isLoading) {
      return undefined
    }

    const orderPriceHistoryRecords = getPriceHistoryByOrderUuidSelector(order.uuid)

    if (!orderPriceHistoryRecords) {
      return undefined
    }

    return orderPriceHistoryRecords
  }, [order, isLoading])

  const priceHistoryRecords = useMemo(function priceHistoryRecordsMemo() {
    return orderPriceHistory?.pricesAtMarks ?? []
  }, [orderPriceHistory])

  const handleHideModal = useCallback(function handleHideModal() {
    onHideModal()
  }, [onHideModal])

  const subTitle = useMemo(function subTitleMemo() {
    const priceAtMarkRecordsQuantity = priceHistoryRecords?.length || 0

    const productName = (!isLoading && getProductByUuidSelector(order.productUuid)?.name) || '(product without name)'
    const locationFullName = (!isLoading && getLocationWithFullNameByUuidSelector(order.locationUuid)) || '(location without name)'

    return (
      <>
        {(
          (order.entityType === 'sell-order' && ('sell'))
          || (order.entityType === 'buy-order' && ('buy'))
        )}
        {' '}
        order for
        {' '}
        <strong>{productName}</strong>
        <br />
        at
        {' '}
        <strong>{locationFullName}</strong>
        <br />
        ( total
        {' '}
        {priceAtMarkRecordsQuantity}
        {' '}
        record
        {priceAtMarkRecordsQuantity > 1 ? 's' : ''}
        {' '}
        {priceAtMarkRecordsQuantity >= ORDER_PRICE_HISTORY_RECORDS_MAX_LIMIT && `max ${ORDER_PRICE_HISTORY_RECORDS_MAX_LIMIT} records`}
        {' '}
        )
      </>
    )
  }, [order, priceHistoryRecords, isLoading])

  const {
    isVisible,
    show: handleShowDeletePriceAtMarksConfirmation,
    hide: handleHideDeletePriceAtMarksConfirmation,
  } = useIsVisible(false)

  const hasEnoughDataForPlot = hasEnoughDataForPriceHistoryPlot(orderPriceHistory)

  return (
    <>
      <Modal
        title={(
          <OrderPricePlotModalTitle
            formTitle="Price dynamic"
            deleteItemButtonLabel={deleteItemButtonLabel}
            handleShowDeletePriceAtMarksConfirmation={handleShowDeletePriceAtMarksConfirmation}
            hasEnoughDataForPlot={hasEnoughDataForPlot}
          />
        )}
        subTitle={subTitle}
        onHide={handleHideModal}
        size="small"
      >
        <div className={styles.ModalBody}>
          <div className={styles.Content}>
            {hasEnoughDataForPlot ? (
              <PriceLinePlot data={priceHistoryRecords} />
            ) : (
              <div className={styles.NoData}>
                No data
              </div>
            )}
          </div>

        </div>
      </Modal>

      {isVisible && (
        <DeletePriceHistoryConfirmation
          onHideModal={handleHideDeletePriceAtMarksConfirmation}
          onHideParentModal={handleHideModal}
          order={order}
        />
      )}
    </>
  )
})
