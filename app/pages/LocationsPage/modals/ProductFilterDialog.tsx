import { memo, useCallback, useMemo } from 'react'
import { useProductRaritiesStore } from '~/stores/entity-stores/ProductRarities.store'
import { useProductTypesStore } from '~/stores/entity-stores/ProductTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useProductRaritiesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductRaritiesAsSelectOptionArray.store'
import { useProductTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductTypesAsSelectOptionArray.store'
import { DialogFilterForm } from '../../../components/dialogs/DialogFilterForm'
import type { ProductFilter } from '../../../models/entities-filters/ProductFilter'
import { getProductFilterFields } from './getProductFilterFields'

interface ProductFilterDialogProps {
  filterValue?: ProductFilter
  onSetFilterValue: (value: ProductFilter | undefined) => void
  onHide: () => void
}
export const ProductFilterDialog = memo(function ProductFilterDialog({
  filterValue,
  onSetFilterValue,
  onHide,
}: ProductFilterDialogProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore, useProductRaritiesStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useProductTypesAsSelectOptionArrayStore, useProductRaritiesAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const productTypesAsSelectOptions = useProductTypesAsSelectOptionArrayStore(state => state.items)
  const productRaritiesAsSelectOptions = useProductRaritiesAsSelectOptionArrayStore(state => state.items)
  const productFilterFields = useMemo(function productFilterFieldsMemo() {
    if (isLoading) {
      return getProductFilterFields([], [])
    }
    return getProductFilterFields(productTypesAsSelectOptions, productRaritiesAsSelectOptions)
  }, [productTypesAsSelectOptions, productRaritiesAsSelectOptions, isLoading])

  const handleHideFilterProductDialog = useCallback(function handleHideFilterProductDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfProductFilter = useCallback(function handleSetValueOfProductFilter(filterAttributes: ProductFilter) {
    const filterValueAttributesNames = Object.keys(filterAttributes)

    if (!filterValueAttributesNames.length) {
      onSetFilterValue(undefined)
    } else {
      onSetFilterValue(filterAttributes)
    }

    handleHideFilterProductDialog()
  }, [handleHideFilterProductDialog, onSetFilterValue])

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      >
        <DialogFilterForm
          humanizedPluralItemTypeName="products"
          filterValue={filterValue}
          formFields={productFilterFields}
          onCancel={handleHideFilterProductDialog}
          onFilter={handleSetValueOfProductFilter}
        />
      </div>
    </>
  )
})
