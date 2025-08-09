import { memo, useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Table, TableBody, type Column } from '~/components/Table'
import { useCloneSelectedItems } from '~/components/tables/hooks/useCloneSelectedItems'
import { useItemsSelecting } from '~/components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '~/components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '~/components/tables/hooks/useSortableTableColumns'
import { useTableFilter } from '~/components/tables/hooks/useTableFilter'
import { useTableFilterApplyingToggler } from '~/components/tables/hooks/useTableFilterApplyingToggler'
import type { Order } from '~/models/Order'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import type { BuyOrderFilter } from '../../../models/entities-filters/BuyOrderFilter'
import type { BuyOrder } from '../../../models/entities/BuyOrder'
import { ENTITY_TYPE_BUY_ORDER } from '../../../models/entities/BuyOrder'
import type { SellOrder } from '../../../models/entities/SellOrder'
import { ENTITY_TYPE_SELL_ORDER } from '../../../models/entities/SellOrder'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { useBuyOrdersStore } from '../../../stores/entity-stores/BuyOrders.store'
import { getProductByUuidSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { getSellOrderByLocationUuidAndProductUuidSelector, useSellOrdersStore } from '../../../stores/entity-stores/SellOrders.store'
import { getBuyOrderFilterFields } from '../getBuyOrderFilterFields'
import { DeleteOrderConfirmation } from '../modals/DeleteOrderConfirmation'
import { EditBuyOrderModal } from '../modals/EditBuyOrderModal'
import { OrderPriceHistoryPlotModal } from '../modals/OrderPriceHistoryPlotModal'
import { FormattedLocationFullName } from './FormattedCells/FormattedLocationFullName'
import { FormattedPriceForOrder } from './FormattedCells/FormattedPriceForOrder'
import { FormattedProductNameForOrder } from './FormattedCells/FormattedProductNameForOrder'
import { FormattedQuantityForOrder } from './FormattedCells/FormattedQuantityForOrder'
import { LocationActionButtonsForOrder } from './FormattedCells/LocationActionButtonsForOrder'
import { PriceActionButtonsForOrder } from './FormattedCells/PriceActionButtonsForOrder'
import { ProductActionButtonsForOrder } from './FormattedCells/ProductActionButtonsForOrder'
import { getOrdersTableFilterInfoFields } from './filterInfoFields/getOrdersTableFilterInfoFields'
import { sortItemsByLocationFullName } from './sortBy/sortItemsByLocationFullNameForOrder'
import { sortItemsByProductName } from './sortBy/sortItemsByProductName'

const sortableGroupColumnNames: (ReturnType<typeof getBuyOrdersTableColumns>)[number]['name'][] = [
  'productUuid',
  'desirableQuantity',
  'price',
  'locationUuid',
]

function getBuyOrdersTableColumns(
  setOrderForPriceChart: (buyOrder: Order) => void
): Column<BuyOrder>[] {
  return [
    {
      name: 'uuid',
      isCheckbox: true,
    },
    {
      name: 'productUuid',
      label: 'product',
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'left',
      formatValue: FormattedProductNameForOrder,
      actionButtons: ProductActionButtonsForOrder,
      sortFn: sortItemsByProductName,
    },
    {
      name: 'desirableQuantity',
      label: 'stock',
      type: 'number',
      isSortable: true,
      formatValue: FormattedQuantityForOrder,
    },
    {
      name: 'price',
      type: 'number',
      isSortable: true,
      sort: 'desc',
      formatValue: FormattedPriceForOrder,
      actionButtons: ({ item }) => <PriceActionButtonsForOrder item={item} setOrderForPriceChart={setOrderForPriceChart} />,
    },
    {
      name: 'locationUuid',
      label: 'location',
      alignLabel: 'right',
      isSortable: true,
      formatValue: FormattedLocationFullName,
      actionButtons: LocationActionButtonsForOrder,
      sortFn: sortItemsByLocationFullName,
    },
  ]
}

interface BuyOrdersTableProps {
  searchFieldValue?: string
  buyOrderFilterValue?: BuyOrderFilter
  setBuyOrderFilterValue: Dispatch<SetStateAction<BuyOrderFilter | undefined>>
  resetSearchFieldValue?: () => void
}
export const BuyOrdersTable = memo(function BuyOrdersTable({
  searchFieldValue,
  buyOrderFilterValue,
  setBuyOrderFilterValue,
  resetSearchFieldValue,
}: BuyOrdersTableProps) {
  const [isBuyOrderCreation, setIsBuyOrderCreation] = useState(false)
  const [buyOrderToEdit, setBuyOrderToEdit] = useState<BuyOrder>()
  const [buyOrderToDelete, setBuyOrderToDelete] = useState<BuyOrder>()

  const buyOrders = useBuyOrdersStore(useShallow(state => state.items()))

  const isLoadingPersistStorages = useLoadingPersistStorages([useSellOrdersStore, useBuyOrdersStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const deleteMultipleBuyOrders = useBuyOrdersStore(state => state.deleteMultiple)

  const createMultipleSellOrders = useSellOrdersStore(state => state.createMultiple)

  const handleResetBuyOrderFilterValue = useCallback(() => {
    setBuyOrderFilterValue(undefined)
  }, [setBuyOrderFilterValue])

  const handleShowCreateBuyOrderModal = useCallback(() => {
    setIsBuyOrderCreation(true)
  }, [setIsBuyOrderCreation])

  const handleHideEditBuyOrderModal = useCallback(() => {
    setBuyOrderToEdit(undefined)
    setIsBuyOrderCreation(false)
  }, [setBuyOrderToEdit, setIsBuyOrderCreation])

  const handleShowDeleteBuyOrderConfirmation = useCallback((item: BuyOrder) => {
    setBuyOrderToDelete(item)
  }, [setBuyOrderToDelete])

  const handleHideDeleteBuyOrderConfirmation = useCallback(() => {
    setBuyOrderToDelete(undefined)
  }, [setBuyOrderToDelete])

  const [selectedOrderForPriceChart, setSelectedOrderForPriceChart] = useState<Order | undefined>(undefined)

  const handleSetOrderForPriceChart = useCallback((buyOrder: Order) => {
    setSelectedOrderForPriceChart(buyOrder)
  }, [setSelectedOrderForPriceChart])

  const handleUnsetOrderForPriceChart = useCallback(() => {
    setSelectedOrderForPriceChart(undefined)
  }, [setSelectedOrderForPriceChart])

  const searchedBuyOrders = useMemo(function searchedBuyOrdersMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (!searchFieldValue) {
      return buyOrders
    }

    return buyOrders.filter(({ productUuid }) => {
      const existingProduct = getProductByUuidSelector(productUuid)

      if (!existingProduct) {
        return false
      }

      return existingProduct.name.includes(searchFieldValue)
    })
  }, [searchFieldValue, buyOrders, isLoading])

  const buyOrderFilterFields = useMemo(function buyOrderFilterFieldsMemo() {
    return getBuyOrderFilterFields([])
  }, [])

  const {
    isAppliedFilter,
    enableFilter,
    disableFilter,
  } = useTableFilterApplyingToggler(buyOrderFilterValue)

  const filteredAndSearchedBuyOrders = useTableFilter(
    searchedBuyOrders,
    buyOrderFilterFields,
    isAppliedFilter ? buyOrderFilterValue : undefined
  )

  const filterInfoFields = useMemo(function filterInfoFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getOrdersTableFilterInfoFields()
  }, [isLoading])

  const buyOrdersTableColumns = useMemo(function buyOrdersTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getBuyOrdersTableColumns(handleSetOrderForPriceChart)
  }, [handleSetOrderForPriceChart, isLoading])

  const {
    sortedItems: sortedAndFilteredAndSearchedBuyOrders,
    columnsToSortBy: buyOrdersTableColumnsToSortBy,
    handleColumnSortClick: handleBuyOrdersTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredAndSearchedBuyOrders,
    buyOrdersTableColumns,
    sortableGroupColumnNames
  )

  const {
    selectedItemsUuids,
    handleResetSelectedItems,
    handleSelectAllItems,
    handleSelectItem,
    handleShowDeleteMultipleSelectedItemsConfirmation,
    DeleteSelectedItemsConfirmation,
  } = useItemsSelecting({
    itemTypeNamePlural: 'buy orders',
    items: sortedAndFilteredAndSearchedBuyOrders,
    searchFieldValue,
    filterValue: buyOrderFilterValue,
    deleteItemsByUuids: deleteMultipleBuyOrders,
    setItemToDelete: setBuyOrderToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_BUY_ORDER,
    items: sortedAndFilteredAndSearchedBuyOrders,
    searchFieldValue,
    filterValue: buyOrderFilterValue,
    resetFilterValue: handleResetBuyOrderFilterValue,
    resetSearchFieldValue,
  })

  const findSimilarItemInTargetTable = useCallback(function findSimilarItemInTargetTable(buyOrder: BuyOrder) {
    const existingSimilarItem = getSellOrderByLocationUuidAndProductUuidSelector(buyOrder)

    return existingSimilarItem ? buyOrder : undefined
  }, [])

  const bulkItemsCopyingIntoTargetTable = useCallback((items: BuyOrder[]) => {
    const newSellOrders = items.map((item) => {
      return {
        entityType: ENTITY_TYPE_SELL_ORDER,
        productUuid: item.productUuid,
        locationUuid: item.locationUuid,
        price: item.price,
        availableQuantity: 0,
      } satisfies WithoutUUID<SellOrder>
    })

    createMultipleSellOrders(newSellOrders)
  }, [createMultipleSellOrders])

  const {
    CopySelectedItemsButton,
    CopyingDialog,
    ItemsWereCopiedNotification,
    NothingToCopyNotification,
  } = useCloneSelectedItems({
    items: sortedAndFilteredAndSearchedBuyOrders,
    selectedItemsUuids,
    onBulkCopyingIntoTargetTable: bulkItemsCopyingIntoTargetTable,
    findSimilarItemInTargetTable: findSimilarItemInTargetTable,
    targetTableName: 'sell orders table',
  })

  return (
    <>
      <Table
        tableTitle="buy orders"
        tableColumns={buyOrdersTableColumns}
        items={sortedAndFilteredAndSearchedBuyOrders}
        noItemsLabel="no buy orders"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add buy order"
        onShowCreateItemModal={handleShowCreateBuyOrderModal}

        columnsToSortBy={buyOrdersTableColumnsToSortBy}
        onColumnHeaderClick={handleBuyOrdersTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}

        filterValue={buyOrderFilterValue}
        isAppliedFilter={isAppliedFilter}
        onEnableFilter={enableFilter}
        onDisableFilter={disableFilter}
        filterInfoFields={filterInfoFields}

        CopySelectedItemsButton={CopySelectedItemsButton}
      >
        <TableBody
          items={sortedAndFilteredAndSearchedBuyOrders}
          columns={buyOrdersTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setBuyOrderToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isBuyOrderCreation || !!buyOrderToEdit) && (
        <EditBuyOrderModal
          itemToEdit={buyOrderToEdit}
          filterValue={buyOrderFilterValue}
          onHideModal={handleHideEditBuyOrderModal}
          onShowDeleteItemConfirmation={handleShowDeleteBuyOrderConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!buyOrderToDelete) && (
        <DeleteOrderConfirmation
          onHideModal={handleHideDeleteBuyOrderConfirmation}
          onHideParentModal={handleHideEditBuyOrderModal}
          itemToDelete={buyOrderToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

      <CopyingDialog />
      {ItemsWereCopiedNotification()}
      {NothingToCopyNotification()}

      {!!selectedOrderForPriceChart && (
        <OrderPriceHistoryPlotModal
          order={selectedOrderForPriceChart}
          onHideModal={handleUnsetOrderForPriceChart}
        />
      )}
    </>
  )
})
