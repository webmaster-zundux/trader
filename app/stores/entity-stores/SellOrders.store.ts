import type { Location } from '~/models/entities/Location'
import type { Product } from '~/models/entities/Product'
import type { SellOrder } from '../../models/entities/SellOrder'
import { createEntityMapStore } from './createEntityMapStore'

export const useSellOrdersStore = createEntityMapStore<SellOrder>({ persistStorageItemKey: 'sell-orders' })

export function getSellOrdersAsMapSelector() {
  return useSellOrdersStore.getState().entities
}

export function getSellOrdersAsArraySelector() {
  return useSellOrdersStore.getState().items()
}

export function getSellOrderByLocationUuidAndProductUuidSelector({
  locationUuid,
  productUuid,
}: {
  locationUuid: Location['uuid']
  productUuid: Product['uuid']
}) {
  const items = getSellOrdersAsArraySelector()

  return items.find(item => (
    (item.locationUuid === locationUuid)
    && (item.productUuid === productUuid)
  ))
}

export function getSellOrderByLocationUuidAndProductUuidExceptItSelfSelector({
  uuid,
  locationUuid,
  productUuid,
}: Pick<SellOrder, 'uuid' | 'productUuid' | 'locationUuid'>) {
  const items = getSellOrdersAsArraySelector()

  return items.find(item => (
    (item.uuid !== uuid)
    && (item.productUuid === productUuid)
    && (item.locationUuid === locationUuid)
  ))
}
