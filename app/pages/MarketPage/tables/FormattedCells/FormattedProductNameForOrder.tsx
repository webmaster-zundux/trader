import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getProductByUuidSelector, useProductsStore } from '~/stores/entity-stores/Products.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedProductNameForOrder({ value }: { value: unknown }) {
  const isLoading = useLoadingPersistStorages([useProductsStore])
  const existingProduct = (isLoading || !isUuid(value)) ? undefined : getProductByUuidSelector(value)

  if (existingProduct?.name) {
    return (
      <>
        {existingProduct.name}
      </>
    )
  }

  return (
    <NoDataCell>
      (no&nbsp;data)
    </NoDataCell>
  )
}
