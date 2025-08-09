import type { Order } from '~/models/Order'
import { isBuyOrder } from '~/models/entities/BuyOrder'
import { isSellOrder } from '~/models/entities/SellOrder'
import { useBuyOrdersStore } from './BuyOrders.store'
import { useSellOrdersStore } from './SellOrders.store'

export function deleteOrderAction(order: Order): void {
  if (isSellOrder(order)) {
    useSellOrdersStore.getState().delete(order)
  } else if (isBuyOrder(order)) {
    useBuyOrdersStore.getState().delete(order)
  } else {
    console.error('Error. Unknown type of order')
  }
}
