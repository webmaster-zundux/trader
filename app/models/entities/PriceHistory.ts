import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'
import type { Order } from '../Order'

export const ENTITY_TYPE_PRICE_HISTORY = 'price-at-marks' as const

export type PriceHistory = Entity & {
  entityType: typeof ENTITY_TYPE_PRICE_HISTORY

  orderUuid: Order['uuid'] // uniq
  pricesAtMarks: [number, number][] // array of uniq pairs (e.g. [quantity: 100, price: 100]) appears only once in the array
}
export type PriceHistoryAttributes = keyof PriceHistory

export const PRICE_HISTORY_ATTRIBUTES: PriceHistoryAttributes[] = ([
  'uuid',
  'entityType',
  'orderUuid',
  'pricesAtMarks'
] as const) satisfies PriceHistoryAttributes[]

export const PRICE_HISTORY_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(PRICE_HISTORY_ATTRIBUTES)

export function isPriceHistory(value: unknown): value is PriceHistory {
  return ((value as PriceHistory)?.entityType === ENTITY_TYPE_PRICE_HISTORY)
}
