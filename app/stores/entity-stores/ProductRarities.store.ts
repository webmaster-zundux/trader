import type { ProductRarity } from '../../models/entities/ProductRarity'
import { createEntityMapStore } from './createEntityMapStore'

export const useProductRaritiesStore = createEntityMapStore<ProductRarity>({
  persistStorageItemKey: 'product-rarities'
})

export function getProductRaritiesAsMapSelector() {
  return useProductRaritiesStore.getState().entities
}

export function getProductRaritiesAsArraySelector() {
  return useProductRaritiesStore.getState().items()
}

export function getLoadingStatusForProductRaritiesSelector() {
  return useProductRaritiesStore.getState().isHydrating
}

export function getProductRarityByUuidSelector(uuid: ProductRarity['uuid']) {
  return getProductRaritiesAsMapSelector().get(uuid)
}

export function getProductRarityByNameSelector(name: ProductRarity['name']) {
  return getProductRaritiesAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getProductRarityByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: ProductRarity) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getProductRaritiesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}

export function getProductRarityByValueExceptItSelfSelector({ uuid, value }: ProductRarity) {
  return getProductRaritiesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.value === value)
  ))
}
