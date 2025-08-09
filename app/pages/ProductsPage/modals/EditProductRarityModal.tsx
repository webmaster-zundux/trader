import { useCallback } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import type { ProductRarity } from '../../../models/entities/ProductRarity'
import { ENTITY_TYPE_PRODUCT_RARITY, PRODUCT_RARITY_ATTRIBUTES, PRODUCT_RARITY_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/ProductRarity'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getProductRarityByNameCaseInsensetiveExceptItSelfSelector, getProductRarityByValueExceptItSelfSelector, useProductRaritiesStore } from '../../../stores/entity-stores/ProductRarities.store'

const productRarityFormFields: FormField<ProductRarity>[] = [
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
  {
    name: 'value',
    type: 'number',
    required: true,
  },
]

interface EditProductRarityModalProps {
  itemToEdit?: ProductRarity | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: ProductRarity) => void
  onCreateItem?: (item: ProductRarity) => void
  onUpdateItem?: (item: ProductRarity) => void
}
export const EditProductRarityModal = ({
  itemToEdit,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditProductRarityModalProps) => {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductRaritiesStore])
  const isLoading = isLoadingPersistStorages

  const createProductRarity = useProductRaritiesStore(state => state.create)
  const updateProductRarity = useProductRaritiesStore(state => state.update)

  const handleCreateItem = useCallback((item: WithoutUUID<ProductRarity>) => {
    const newItem = createProductRarity(item)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createProductRarity, onCreateItem])

  const handleUpdateItem = useCallback((item: ProductRarity) => {
    const updatedItem = updateProductRarity(item)

    if (!updatedItem) {
      return
    }

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateProductRarity, onUpdateItem])

  const handleHideEditProductRarityModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<ProductRarity> | ProductRarity
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes
        = getAttributesByWhiteList<WithoutUUID<ProductRarity>>(itemData, PRODUCT_RARITY_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_PRODUCT_RARITY

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<ProductRarity>(itemData, PRODUCT_RARITY_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditProductRarityModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditProductRarityModal])

  const validateProductRarityFormData = useCallback((
    productRarity: ProductRarity
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

    const existingProductRarityWithTheSameName = getProductRarityByNameCaseInsensetiveExceptItSelfSelector(productRarity)

    if (existingProductRarityWithTheSameName) {
      return function ErrorMessage() {
        return (
          <>
            Product rarity named
            {' '}
            <strong>
              {existingProductRarityWithTheSameName.name}
            </strong>
            {' '}
            already exists
          </>
        )
      }
    }

    const existingProductRarityWithTheSameRarityValue = getProductRarityByValueExceptItSelfSelector(productRarity)

    if (existingProductRarityWithTheSameRarityValue) {
      return function ErrorMessage() {
        return (
          <>
            Product rarity with value
            {' '}
            <strong>{existingProductRarityWithTheSameRarityValue.value}</strong>
            {' '}
            (named
            {' '}
            <strong>{existingProductRarityWithTheSameRarityValue.name}</strong>
            {' '}
            ) already exists
          </>
        )
      }
    }

    return undefined
  }, [isLoading])

  return (
    <ModalEditForm
      humanizedItemTypeName="product rarity"
      itemToEdit={itemToEdit}
      formFields={productRarityFormFields}
      validateFormData={validateProductRarityFormData}
      onCancel={handleHideEditProductRarityModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete product rarity"
    />
  )
}
