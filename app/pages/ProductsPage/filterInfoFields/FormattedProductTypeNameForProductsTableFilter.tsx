import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getProductTypeByUuidSelector, useProductTypesStore } from '~/stores/entity-stores/ProductTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedProductTypeNameForProductsTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([useProductTypesStore])

  if (!value) {
    return undefined
  }
  const productTypeName = (isLoading || !isUuid(value)) ? undefined : getProductTypeByUuidSelector(value)?.name

  if (!productTypeName) {
    return {
      label: label ?? name?.toString(),
      value: `(product type without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: productTypeName,
  }
}
