import type { Order } from '../../models/Order'
import type { SelectedOrderForPriceHistoryPlot } from '../../models/table-selects/SelectedOrderForPricePlot'
import { ENTITY_TYPE_SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT } from '../../models/table-selects/SelectedOrderForPricePlot'
import { createEntityMapStore } from '../entity-stores/createEntityMapStore'

export const useSelectedOrderForPriceHistoryPlotStore = createEntityMapStore<SelectedOrderForPriceHistoryPlot>({ maxCapacity: 1 })

export function getSelectedOrdersForPriceHistoryPlotSelector() {
  return useSelectedOrderForPriceHistoryPlotStore.getState().items()
}

export function setSelectedOrderForPriceHistoryPlotAction(order: Order): void {
  useSelectedOrderForPriceHistoryPlotStore.getState().create({
    entityType: ENTITY_TYPE_SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT,
    order: order,
  })
}

export function unsetSelectedOrderForPriceHistoryPlotAction(): void {
  useSelectedOrderForPriceHistoryPlotStore.getState().clear()
}

export function getSelectedOrderForPriceHistoryPlotSelector() {
  return getSelectedOrdersForPriceHistoryPlotSelector()[0]?.order
}
