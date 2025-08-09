import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { OrderBase } from './OrderBase'

export const ENTITY_TYPE_BUY_ORDER = 'buy-order' as const

export type BuyOrder = OrderBase & {
  entityType: typeof ENTITY_TYPE_BUY_ORDER

  desirableQuantity: number
}

export type BuyOrderAttributes = keyof BuyOrder

export const BUY_ORDER_ATTRIBUTES: BuyOrderAttributes[] = ([
  'uuid',
  'entityType',
  'productUuid',
  'locationUuid',
  'price',
  'desirableQuantity'
] as const) satisfies BuyOrderAttributes[]

export const BUY_ORDER_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(BUY_ORDER_ATTRIBUTES)

export function isBuyOrder(value: unknown): value is BuyOrder {
  return ((value as BuyOrder)?.entityType === ENTITY_TYPE_BUY_ORDER)
}
