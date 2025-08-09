import type { BuyOrder, ENTITY_TYPE_BUY_ORDER } from './entities/BuyOrder'
import type { ENTITY_TYPE_SELL_ORDER, SellOrder } from './entities/SellOrder'

export type OrderType =
  | typeof ENTITY_TYPE_SELL_ORDER
  | typeof ENTITY_TYPE_BUY_ORDER

export type Order =
  | SellOrder
  | BuyOrder
