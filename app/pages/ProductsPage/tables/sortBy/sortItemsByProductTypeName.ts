import { isUuid } from '~/models/Entity'
import { getLoadingStatusForProductTypesSelector, getProductTypeByUuidSelector } from '~/stores/entity-stores/ProductTypes.store'

export function sortItemsByProductTypeName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const isLoading = getLoadingStatusForProductTypesSelector()

  if (isLoading) {
    return 0
  }

  const itemAName = (isUuid(aItemUuid) && getProductTypeByUuidSelector(aItemUuid)?.name) || ''
  const itemBName = (isUuid(bItemUuid) && getProductTypeByUuidSelector(bItemUuid)?.name) || ''

  return itemAName.localeCompare(itemBName)
}
