import type { Order } from '../../models/Order'
import type { PriceHistory } from '../../models/entities/PriceHistory'
import { createEntityMapStore } from './createEntityMapStore'

export const ORDER_PRICE_HISTORY_RECORDS_MAX_LIMIT = 1000

export const usePriceHistoriesStore = createEntityMapStore<PriceHistory>({
  persistStorageItemKey: 'prices-at-marks',
  maxCapacity: ORDER_PRICE_HISTORY_RECORDS_MAX_LIMIT
})

export function getPriceHistoryAsMapSelector() {
  return usePriceHistoriesStore.getState().entities
}

export function getPriceHistoryAsArraySelector() {
  return usePriceHistoriesStore.getState().items()
}

export function getPriceHistoryByUuidSelector(uuid: PriceHistory['uuid']) {
  return getPriceHistoryAsMapSelector().get(uuid)
}

export function getPriceHistoryByOrderUuidSelector(orderUuid: Order['uuid']): PriceHistory | undefined {
  return getPriceHistoryAsArraySelector().find(priceHistory => priceHistory.orderUuid === orderUuid)
}

// deprecated - todo to replace by hasEnoughDataForPriceHistoryPlotForOrderSelector
export function hasEnoughDataForPriceHistoryPlot(priceHistory?: PriceHistory): boolean {
  if (!priceHistory) {
    return false
  }

  return (priceHistory?.pricesAtMarks.length || 0) > 1
}

export function hasEnoughDataForPriceHistoryPlotForOrderSelector(orderUuid: Order['uuid']): boolean {
  const orderPriceHistory = getPriceHistoryByOrderUuidSelector(orderUuid)

  return hasEnoughDataForPriceHistoryPlot(orderPriceHistory)
}

export function deletePriceHistoryAction(priceHistory: PriceHistory) {
  usePriceHistoriesStore.getState().delete(priceHistory)
}

export function deletePriceHistoryByOrderUuidAction(orderUuid: Order['uuid']) {
  const existingOrderPriceHistory = getPriceHistoryByOrderUuidSelector(orderUuid)

  if (!existingOrderPriceHistory) {
    return
  }

  deletePriceHistoryAction(existingOrderPriceHistory)
}
