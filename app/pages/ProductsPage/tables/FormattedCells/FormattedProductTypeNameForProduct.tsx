import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getProductTypeByUuidSelector, useProductTypesStore } from '~/stores/entity-stores/ProductTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedProductTypeNameForProduct({ value }: { value: unknown }) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore])
  const isLoading = isLoadingPersistStorages

  const productTypeName = (isLoading || !isUuid(value)) ? undefined : getProductTypeByUuidSelector(value)?.name

  return (
    <>
      {productTypeName
        ? productTypeName
        : (
            <NoDataCell>
              (no&nbsp;data)
            </NoDataCell>
          )}
    </>
  )
}
