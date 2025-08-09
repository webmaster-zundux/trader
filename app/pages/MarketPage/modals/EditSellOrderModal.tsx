import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { useProductsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductsAsSelectOptionArray.store'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import { useFilterValuesAsDefaultValuesInFormFields } from '../../../components/forms/hooks/useFilterValuesToSetDefaultValuesInFormFields'
import { ModalEditForm } from '../../../components/forms/ModalEditForm'
import type { SellOrderFilter } from '../../../models/entities-filters/SellOrderFilter'
import type { PriceHistory } from '../../../models/entities/PriceHistory'
import { ENTITY_TYPE_PRICE_HISTORY } from '../../../models/entities/PriceHistory'
import type { SellOrder } from '../../../models/entities/SellOrder'
import { ENTITY_TYPE_SELL_ORDER, SELL_ORDER_ATTRIBUTES, SELL_ORDER_ATTRIBUTES_WITHOUT_UUID } from '../../../models/entities/SellOrder'
import { getAttributesByWhiteList } from '../../../models/utils/getAttributesByWhiteList'
import { hasUuid } from '../../../models/utils/hasUuid'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { useLocationsStore } from '../../../stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '../../../stores/entity-stores/PlanetarySystems.store'
import { getPriceHistoryByOrderUuidSelector, usePriceHistoriesStore } from '../../../stores/entity-stores/PriceHistories.store'
import { getProductByUuidSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { getSellOrderByLocationUuidAndProductUuidExceptItSelfSelector, useSellOrdersStore } from '../../../stores/entity-stores/SellOrders.store'
import { getEditSellOrderFormFields } from './getEditSellOrderFormFields'

interface EditSellOrderModalProps {
  itemToEdit?: SellOrder | undefined
  filterValue?: SellOrderFilter | undefined
  onHideModal: () => void
  onShowDeleteItemConfirmation: (item: SellOrder) => void
  onCreateItem?: (item: SellOrder) => void
  onUpdateItem?: (item: SellOrder) => void
}
export const EditSellOrderModal = memo(function EditSellOrderModal({
  itemToEdit,
  filterValue,
  onHideModal,
  onShowDeleteItemConfirmation,
  onCreateItem,
  onUpdateItem,
}: EditSellOrderModalProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useSellOrdersStore, usePriceHistoriesStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore, useProductsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const createSellOrder = useSellOrdersStore(state => state.create)
  const updateSellOrder = useSellOrdersStore(state => state.update)

  const createPriceHistory = usePriceHistoriesStore(state => state.create)
  const updatePriceHistory = usePriceHistoriesStore(state => state.update)

  const handleCreatePriceHistory = useCallback((order: SellOrder) => {
    createPriceHistory({
      entityType: ENTITY_TYPE_PRICE_HISTORY,
      orderUuid: order.uuid,
      pricesAtMarks: [[order.price, order.availableQuantity]],
    } satisfies WithoutUUID<PriceHistory>)
  }, [createPriceHistory])

  const handleUpdateOrCreatePriceHistory = useCallback(function handleUpdateOrCreatePriceHistory(order: SellOrder) {
    const newPriceHistoryRecord = [order.price, order.availableQuantity] as PriceHistory['pricesAtMarks'][number]
    const existingPriceHistory = getPriceHistoryByOrderUuidSelector(order.uuid)

    if (existingPriceHistory) {
      const existingPriceHistoryRecord = existingPriceHistory.pricesAtMarks.find(priceHistoryRecord => (
        (priceHistoryRecord[0] === newPriceHistoryRecord[0])
        && (priceHistoryRecord[1] === newPriceHistoryRecord[1])
      ))

      if (existingPriceHistoryRecord) {
        return
      }

      updatePriceHistory({
        ...existingPriceHistory,
        pricesAtMarks: existingPriceHistory.pricesAtMarks.concat([newPriceHistoryRecord]),
      } satisfies WithoutUUID<PriceHistory>)
    } else {
      handleCreatePriceHistory(order)
    }
  }, [updatePriceHistory, handleCreatePriceHistory])

  const handleCreateItem = useCallback((item: WithoutUUID<SellOrder>) => {
    const newItem = createSellOrder(item)

    handleCreatePriceHistory(newItem)

    if (typeof onCreateItem !== 'function') {
      return
    }

    onCreateItem(newItem)
  }, [createSellOrder, onCreateItem, handleCreatePriceHistory])

  const handleUpdateItem = useCallback((item: SellOrder) => {
    const updatedItem = updateSellOrder(item)

    if (!updatedItem) {
      return
    }
    handleUpdateOrCreatePriceHistory(updatedItem)

    if (typeof onUpdateItem !== 'function') {
      return
    }

    onUpdateItem(updatedItem)
  }, [updateSellOrder, onUpdateItem, handleUpdateOrCreatePriceHistory])

  const handleHideEditSellOrderModal = useCallback(() => {
    onHideModal()
  }, [onHideModal])

  const handleSubmit = useCallback((
    itemData: WithoutUUID<SellOrder> | SellOrder
  ) => {
    if (!hasUuid(itemData)) {
      const dataAttributes = getAttributesByWhiteList<WithoutUUID<SellOrder>>(itemData, SELL_ORDER_ATTRIBUTES_WITHOUT_UUID)

      dataAttributes.entityType = ENTITY_TYPE_SELL_ORDER

      handleCreateItem(dataAttributes)
    } else {
      const dataAttributes = getAttributesByWhiteList<SellOrder>(itemData, SELL_ORDER_ATTRIBUTES)

      handleUpdateItem(dataAttributes)
    }

    handleHideEditSellOrderModal()
  }, [handleCreateItem, handleUpdateItem, handleHideEditSellOrderModal])

  const validateSellOrderFormData = useCallback(function validateSellOrderFormData(
    itemData: SellOrder
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

    const existingSellOrder = getSellOrderByLocationUuidAndProductUuidExceptItSelfSelector(itemData)

    if (existingSellOrder) {
      const productName = getProductByUuidSelector(existingSellOrder.productUuid)?.name || '(product without name)'
      const locationFullName = getLocationWithFullNameByUuidSelector(existingSellOrder.locationUuid) || '(location without name)'

      return function ErrorMessage() {
        return (
          <span>
            Sell order for
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

  const sellOrderFormFields = useMemo(function sellOrderFormFieldsMemo() {
    if (isLoadingSimpleCacheStorages) {
      return getEditSellOrderFormFields([], [])
    }
    return getEditSellOrderFormFields(productsAsSelectOptions, locationsAsSelectOptions)
  }, [productsAsSelectOptions, locationsAsSelectOptions, isLoadingSimpleCacheStorages])

  const sellOrderFormFieldsWithOptionalDefaultValues: FormField<SellOrder>[] = useFilterValuesAsDefaultValuesInFormFields<SellOrderFilter, SellOrder>(sellOrderFormFields, filterValue)

  return (
    <ModalEditForm
      humanizedItemTypeName="sell order"
      itemToEdit={itemToEdit}
      formFields={sellOrderFormFieldsWithOptionalDefaultValues}
      validateFormData={validateSellOrderFormData}
      onCancel={handleHideEditSellOrderModal}
      onSubmit={handleSubmit}
      onDelete={onShowDeleteItemConfirmation}
      deleteItemButtonLabel="delete sell order"
    />
  )
})
