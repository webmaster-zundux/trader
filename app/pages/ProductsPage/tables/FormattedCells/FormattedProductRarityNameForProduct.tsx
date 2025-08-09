import { NoDataCell } from '~/components/Table'
import { isUuid } from '~/models/Entity'
import { getProductRarityByUuidSelector, useProductRaritiesStore } from '~/stores/entity-stores/ProductRarities.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedProductRarityNameForProduct({ value }: { value: unknown }) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductRaritiesStore])
  const isLoading = isLoadingPersistStorages

  const productRarityName = (isLoading || !isUuid(value)) ? undefined : getProductRarityByUuidSelector(value)?.name

  return (
    <>
      {productRarityName
        ? productRarityName
        : (
            <NoDataCell>
              (no&nbsp;data)
            </NoDataCell>
          )}
    </>
  )
}
