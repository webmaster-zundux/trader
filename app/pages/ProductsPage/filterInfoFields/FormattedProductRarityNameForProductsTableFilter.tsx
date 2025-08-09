import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getProductRarityByUuidSelector, useProductRaritiesStore } from '~/stores/entity-stores/ProductRarities.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedProductRarityNameForProductsTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([useProductRaritiesStore])

  if (!value) {
    return undefined
  }
  const productRarityName = (isLoading || !isUuid(value)) ? undefined : getProductRarityByUuidSelector(value)?.name

  if (!productRarityName) {
    return {
      label: label ?? name?.toString(),
      value: `(product rarity without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: productRarityName,
  }
}
