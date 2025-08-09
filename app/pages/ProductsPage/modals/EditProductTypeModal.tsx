import type React from 'react'
import { useCallback } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import type { ProductType } from '../../../models/entities/ProductType'
import { ENTITY_TYPE_PRODUCT_TYPE, PRODUCT_TYPE_ATTRIBUTES, PRODUCT_TYPE_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/ProductType'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getProductTypeByNameCaseInsensetiveExceptItSelfSelector, useProductTypesStore } from '../../../stores/entity-stores/ProductTypes.store'

const productTypeFormFields: FormField<ProductType>[] = [
  {
    name: 'uuid',
    type: 'hidden',
  },
  {
    name: 'entityType',
    type: 'hidden',
  },
  {
    name: 'name',
    required: true,
  },
]

interface EditProductTypeModalProps {
  itemToEdit?: ProductType | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: ProductType) => void
  onCreateItem?: (item: ProductType) => void
  onUpdateItem?: (item: ProductType) => void
}
export const EditProductTypeModal = ({
  itemToEdit,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditProductTypeModalProps) => {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore])
  const isLoading = isLoadingPersistStorages

  const createProductType = useProductTypesStore(state => state.create)
  const updateProductType = useProductTypesStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<ProductType>) => {
    const newItem = createProductType(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createProductType, onCreateItem])

  const handleUpdateItem = useCallback((item: ProductType) => {
    const updatedItem = updateProductType(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateProductType, onUpdateItem])

  const handleHideEditProductTypeModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<ProductType> | ProductType
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<ProductType>>(itemData, PRODUCT_TYPE_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_PRODUCT_TYPE

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<ProductType>(itemData, PRODUCT_TYPE_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditProductTypeModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditProductTypeModal])

  const validateProductTypeFormData = useCallback((
    productType: ProductType
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

    const existingProductTypeWithTheSameName = getProductTypeByNameCaseInsensetiveExceptItSelfSelector(productType)

    if (existingProductTypeWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Product type named
            {' '}
            <strong>
              {existingProductTypeWithTheSameName.name}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  return (
    <ModalEditForm
      humanizedItemTypeName="product type"
      itemToEdit={itemToEdit}
      formFields={productTypeFormFields}
      validateFormData={validateProductTypeFormData}
      onCancel={handleHideEditProductTypeModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete product type"
    />
  )
}
