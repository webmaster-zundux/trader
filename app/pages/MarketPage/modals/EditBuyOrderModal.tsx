import type React from 'react'
import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { useProductsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductsAsSelectOptionArray.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import type { BuyOrderFilter } from '../../../models/entities-filters/BuyOrderFilter'
import type { BuyOrder } from '../../../models/entities/BuyOrder'
import { BUY_ORDER_ATTRIBUTES, BUY_ORDER_ATTRIBUTES_WITHOUT_UUID, ENTITY_TYPE_BUY_ORDER } from '../../../models/entities/BuyOrder'
import type { PriceHistory } from '../../../models/entities/PriceHistory'
import { ENTITY_TYPE_PRICE_HISTORY } from '../../../models/entities/PriceHistory'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getBuyOrderByLocationUuidAndProductUuidExceptItSelfSelector, useBuyOrdersStore } from '../../../stores/entity-stores/BuyOrders.store'
import { useLocationsStore } from '../../../stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '../../../stores/entity-stores/PlanetarySystems.store'
import { getPriceHistoryByOrderUuidSelector, usePriceHistoriesStore } from '../../../stores/entity-stores/PriceHistories.store'
import { getProductByUuidSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { getEditBuyOrderFormFields } from './getEditBuyOrderFormFields'

interface EditBuyOrderModalProps {
  itemToEdit?: BuyOrder | undefined
  filterValue?: BuyOrderFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: BuyOrder) => void
  onCreateItem?: (item: BuyOrder) => void
  onUpdateItem?: (item: BuyOrder) => void
}
export const EditBuyOrderModal = memo(function EditBuyOrderModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditBuyOrderModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useBuyOrdersStore, usePriceHistoriesStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore, useProductsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const createBuyOrder = useBuyOrdersStore(state => state.create)
  const updateBuyOrder = useBuyOrdersStore(state => state.update)

  const createPriceAtMarks = usePriceHistoriesStore(state => state.create)
  const updatePriceAtMarks = usePriceHistoriesStore(state => state.update)

  const handleCreatePriceAtMarks = useCallback((order: BuyOrder) => {
    createPriceAtMarks({
      entityType: ENTITY_TYPE_PRICE_HISTORY,
      orderUuid: order.uuid,
      pricesAtMarks: [[order.price, order.desirableQuantity]],
    } satisfies WithoutUUID<PriceHistory>)
  }, [createPriceAtMarks])

  const handleUpdateOrCreatePriceAtMarks = useCallback((order: BuyOrder) => {
    const newPriceHistoryRecord = [order.price, order.desirableQuantity] as PriceHistory['pricesAtMarks'][number]
    const existingPriceHistory = getPriceHistoryByOrderUuidSelector(order.uuid)

    if (existingPriceHistory) {
      const existingPriceHistoryRecord = existingPriceHistory.pricesAtMarks.find(priceHistoryRecord => (
        (priceHistoryRecord[0] === newPriceHistoryRecord[0])
        && (priceHistoryRecord[1] === newPriceHistoryRecord[1])
      ))

      if (existingPriceHistoryRecord) {
        return
      }

      updatePriceAtMarks({
        ...existingPriceHistory,
        pricesAtMarks: existingPriceHistory.pricesAtMarks.concat([newPriceHistoryRecord]),
      } satisfies WithoutUUID<PriceHistory>)
    } else {
      handleCreatePriceAtMarks(order)
    }
  }, [updatePriceAtMarks, handleCreatePriceAtMarks])

  const handleCreateItem = useCallback((item: WithoutUUID<BuyOrder>) => {
    const newItem = createBuyOrder(item)

    handleCreatePriceAtMarks(newItem)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createBuyOrder, onCreateItem, handleCreatePriceAtMarks])

  const handleUpdateItem = useCallback((item: BuyOrder) => {
    const updatedItem = updateBuyOrder(item)

    if (!updatedItem) {
      return
    }
    handleUpdateOrCreatePriceAtMarks(updatedItem)

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateBuyOrder, onUpdateItem, handleUpdateOrCreatePriceAtMarks])

  const handleHideEditBuyOrderModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<BuyOrder> | BuyOrder
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<BuyOrder>>(itemData, BUY_ORDER_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_BUY_ORDER

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<BuyOrder>(itemData, BUY_ORDER_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditBuyOrderModal()
  }, [handleHideEditBuyOrderModal, handleCreateItem, handleUpdateItem])

  const validateBuyOrderFormData = useCallback(function validateBuyOrderFormData(
    itemData: BuyOrder
  ): string | (() => React.JSX.Element) | undefined {
    if (isLoading) {
      return function ErrorMessage() {
        return (
          <span>
            Loading...
          </span>
        )
      }
    }

    const existingBuyOrder = getBuyOrderByLocationUuidAndProductUuidExceptItSelfSelector(itemData)

    if (existingBuyOrder) {
      const productName = getProductByUuidSelector(existingBuyOrder.productUuid)?.name || '(product without name)'
      const locationFullName = getLocationWithFullNameByUuidSelector(existingBuyOrder.locationUuid) || '(location without name)'

      return function ErrorMessage() {
        return (
          <span>
            Buy order for
            {' '}
            <strong>{productName}</strong>
            {' '}
            in
            {' '}
            <strong>{locationFullName}</strong>
            {' '}
            already exists
          </span>
        )
      }
    }

    return undefined
  }, [isLoading])

  const productsAsSelectOptions = useProductsAsSelectOptionArrayStore(state => state.items)
  const locationsAsSelectOptions = useLocationsAsSelectOptionArrayStore(state => state.items)

  const buyOrderFormFields = useMemo(function buyOrderFormFieldsMemo() {
    if (isLoadingSimpleCacheStorages) {
      return getEditBuyOrderFormFields([], [])
    }

    return getEditBuyOrderFormFields(productsAsSelectOptions, locationsAsSelectOptions)
  }, [productsAsSelectOptions, locationsAsSelectOptions, isLoadingSimpleCacheStorages])

  const buyOrderFormFieldsWithOptionalDefaultValues: FormField<BuyOrder>[] =
    useFilterValuesAsDefaultValuesInFormFields<BuyOrderFilter, BuyOrder>(buyOrderFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="buy order"
      itemToEdit={itemToEdit}
      formFields={buyOrderFormFieldsWithOptionalDefaultValues}
      validateFormData={validateBuyOrderFormData}
      onCancel={handleHideEditBuyOrderModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete buy order"
    />
  )
})
