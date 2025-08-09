import { isUuid } from '~/models/Entity'
import { getLoadingStatusForProductsSelector, getProductByUuidSelector } from '~/stores/entity-stores/Products.store'

export function sortItemsByProductName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const isLoading = getLoadingStatusForProductsSelector()

  if (isLoading) {
    return 0
  }

  const productNameA = (isUuid(aItemUuid) && getProductByUuidSelector(aItemUuid)?.name) || ''
  const productNameB = (isUuid(bItemUuid) && getProductByUuidSelector(bItemUuid)?.name) || ''

  return productNameA.localeCompare(productNameB)
}
