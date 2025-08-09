import { isUuid } from '~/models/Entity'
import { getLoadingStatusForProductRaritiesSelector, getProductRarityByUuidSelector } from '~/stores/entity-stores/ProductRarities.store'

export function sortItemsByProductRarityName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const isLoading = getLoadingStatusForProductRaritiesSelector()

  if (isLoading) {
    return 0
  }

  const itemAName = (isUuid(aItemUuid) && getProductRarityByUuidSelector(aItemUuid)?.name) || ''
  const itemBName = (isUuid(bItemUuid) && getProductRarityByUuidSelector(bItemUuid)?.name) || ''

  return itemAName.localeCompare(itemBName)
}
