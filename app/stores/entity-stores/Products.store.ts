import type { Product } from '../../models/entities/Product'
import { createEntityMapStore } from './createEntityMapStore'

export const useProductsStore = createEntityMapStore<Product>({
  persistStorageItemKey: 'products'
})

export function getProductsAsMapSelector() {
  return useProductsStore.getState().entities
}

export function getProductsAsArraySelector() {
  return useProductsStore.getState().items()
}

export function getLoadingStatusForProductsSelector() {
  return useProductsStore.getState().isHydrating
}

export function getProductByUuidSelector(uuid: Product['uuid']) {
  return getProductsAsMapSelector().get(uuid)
}

export function getProductByNameSelector(name: Product['name']) {
  return getProductsAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getProductByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: Product) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getProductsAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}
