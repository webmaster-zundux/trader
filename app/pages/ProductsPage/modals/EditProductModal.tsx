import type React from 'react'
import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useProductRaritiesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductRaritiesAsSelectOptionArray.store'
import { useProductTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductTypesAsSelectOptionArray.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import type { ProductFilter } from '../../../models/entities-filters/ProductFilter'
import type { Product } from '../../../models/entities/Product'
import { ENTITY_TYPE_PRODUCT, PRODUCT_ATTRIBUTES, PRODUCT_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/Product'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { useProductRaritiesStore } from '../../../stores/entity-stores/ProductRarities.store'
import { useProductTypesStore } from '../../../stores/entity-stores/ProductTypes.store'
import { getProductByNameCaseInsensetiveExceptItSelfSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { getEditProductFormFields } from './getEditProductFormFields'

interface EditProductModalProps {
  itemToEdit?: Product | undefined
  filterValue?: ProductFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: Product) => void
  onCreateItem?: (item: Product) => void
  onUpdateItem?: (item: Product) => void
}
export const EditProductModal = memo(function EditProductModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditProductModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductsStore, useProductTypesStore, useProductRaritiesStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useProductTypesAsSelectOptionArrayStore, useProductRaritiesAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const createProduct = useProductsStore(state => state.create)
  const updateProduct = useProductsStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<Product>) => {
    const newItem = createProduct(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createProduct, onCreateItem])

  const handleUpdateItem = useCallback((item: Product) => {
    const updatedItem = updateProduct(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateProduct, onUpdateItem])

  const handleHideEditProductModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback(async (
    itemData: WithoutUUID<Product> | Product
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<Product>>(itemData, PRODUCT_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_PRODUCT

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<Product>(itemData, PRODUCT_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditProductModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditProductModal])

  const validateProductFormData = useCallback((
    product: Product
  ): string | (() => React.JSX.Element) | undefined => {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingProductWithTheSameName = getProductByNameCaseInsensetiveExceptItSelfSelector(product)

    if (existingProductWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Product named
            {' '}
            <strong>
              {existingProductWithTheSameName.name}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  const productTypessAsSelectOptions = useProductTypesAsSelectOptionArrayStore(state => state.items)

  const productRaritiesAsSelectOptions = useProductRaritiesAsSelectOptionArrayStore(state => state.items)

  const productFormFields = useMemo(function productFormFieldsMemo() {
    if (isLoading) {
      return getEditProductFormFields([], [])
    }

    return getEditProductFormFields(productRaritiesAsSelectOptions, productTypessAsSelectOptions)
  }, [productRaritiesAsSelectOptions, productTypessAsSelectOptions, isLoading])

  const productFormFieldsWithOptionalDefaultValues: FormField<Product>[] = useFilterValuesAsDefaultValuesInFormFields<ProductFilter, Product>(productFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="product"
      itemToEdit={itemToEdit}
      formFields={productFormFieldsWithOptionalDefaultValues}
      validateFormData={validateProductFormData}
      onCancel={handleHideEditProductModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete product"
    />
  )
})
