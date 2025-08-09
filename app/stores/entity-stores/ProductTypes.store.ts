import type { ProductType } from '../../models/entities/ProductType'
import { createEntityMapStore } from './createEntityMapStore'

export const useProductTypesStore = createEntityMapStore<ProductType>({
  persistStorageItemKey: 'product-types'
})

export function getProductTypesAsMapSelector() {
  return useProductTypesStore.getState().entities
}

export function getProductTypesAsArraySelector() {
  return useProductTypesStore.getState().items()
}

export function getLoadingStatusForProductTypesSelector() {
  return useProductTypesStore.getState().isHydrating
}

export function getProductTypeByUuidSelector(uuid: ProductType['uuid']) {
  return getProductTypesAsMapSelector().get(uuid)
}

export function getProductTypeByNameSelector(name: ProductType['name']) {
  return getProductTypesAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getProductTypeByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: ProductType) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getProductTypesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}
