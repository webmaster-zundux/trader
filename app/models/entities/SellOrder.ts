import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { OrderBase } from './OrderBase'

export const ENTITY_TYPE_SELL_ORDER = 'sell-order' as const

export type SellOrder = OrderBase & {
  entityType: typeof ENTITY_TYPE_SELL_ORDER

  availableQuantity: number
}

export type SellOrderAttributes = keyof SellOrder

export const SELL_ORDER_ATTRIBUTES: SellOrderAttributes[] = ([
  'uuid',
  'entityType',
  'productUuid',
  'locationUuid',
  'price',
  'availableQuantity'
] as const) satisfies SellOrderAttributes[]

export const SELL_ORDER_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(SELL_ORDER_ATTRIBUTES)

export function isSellOrder(value: unknown): value is SellOrder {
  return ((value as SellOrder)?.entityType === ENTITY_TYPE_SELL_ORDER)
}
