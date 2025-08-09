import type { Location } from '~/models/entities/Location'
import type { Product } from '~/models/entities/Product'
import type { BuyOrder } from '../../models/entities/BuyOrder'
import { createEntityMapStore } from './createEntityMapStore'

export const useBuyOrdersStore = createEntityMapStore<BuyOrder>({ persistStorageItemKey: 'buy-orders' })

export function getBuyOrdersAsMapSelector() {
  return useBuyOrdersStore.getState().entities
}

export function getBuyOrdersAsArraySelector() {
  return useBuyOrdersStore.getState().items()
}

export function getBuyOrderByLocationUuidAndProductUuidSelector({
  locationUuid,
  productUuid,
}: {
  locationUuid: Location['uuid']
  productUuid: Product['uuid']
}) {
  const items = getBuyOrdersAsArraySelector()

  return items.find(item => (
    (item.locationUuid === locationUuid)
    && (item.productUuid === productUuid)
  ))
}

export function getBuyOrderByLocationUuidAndProductUuidExceptItSelfSelector({
  uuid,
  locationUuid,
  productUuid,
}: Pick<BuyOrder, 'uuid' | 'productUuid' | 'locationUuid'>) {
  const items = getBuyOrdersAsArraySelector()

  return items.find(item => (
    (item.uuid !== uuid)
    && (item.productUuid === productUuid)
    && (item.locationUuid === locationUuid)
  ))
}
