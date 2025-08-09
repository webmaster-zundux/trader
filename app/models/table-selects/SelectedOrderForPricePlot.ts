import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'
import type { Order } from '../Order'

export const ENTITY_TYPE_SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT = 'selected-order-for-price-history-plot' as const

export type SelectedOrderForPriceHistoryPlot = Entity & {
  entityType: typeof ENTITY_TYPE_SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT
  order?: Order
}

export type SelectedOrderForPriceHistoryPlotAttributes = keyof SelectedOrderForPriceHistoryPlot

export const SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT_ATTRIBUTES: SelectedOrderForPriceHistoryPlotAttributes[] = (['uuid', 'entityType', 'order'] as const) satisfies SelectedOrderForPriceHistoryPlotAttributes[]

export const ORDER_SELECT_FOR_PRICE_HISTORY_PLOT_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT_ATTRIBUTES)

export function isSelectedOrderForPriceHistoryPlot(value: unknown): value is SelectedOrderForPriceHistoryPlot {
  return ((value as SelectedOrderForPriceHistoryPlot)?.entityType === ENTITY_TYPE_SELECTED_ORDER_FOR_PRICE_HISTORY_PLOT)
}
