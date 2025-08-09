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
import type { SellOrderFilter } from '../../../models/entities-filters/SellOrderFilter'
import type { BuyOrder } from '../../../models/entities/BuyOrder'
import { ENTITY_TYPE_BUY_ORDER } from '../../../models/entities/BuyOrder'
import type { SellOrder } from '../../../models/entities/SellOrder'
import { ENTITY_TYPE_SELL_ORDER } from '../../../models/entities/SellOrder'
import type { WithoutUUID } from '../../../models/utils/utility-types'
import { getBuyOrderByLocationUuidAndProductUuidSelector, useBuyOrdersStore } from '../../../stores/entity-stores/BuyOrders.store'
import { getProductByUuidSelector, useProductsStore } from '../../../stores/entity-stores/Products.store'
import { useSellOrdersStore } from '../../../stores/entity-stores/SellOrders.store'
import { getSellOrderFilterFields } from '../getSellOrderFilterFields'
import { DeleteOrderConfirmation } from '../modals/DeleteOrderConfirmation'
import { EditSellOrderModal } from '../modals/EditSellOrderModal'
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

const sortableGroupColumnNames: (ReturnType<typeof getSellOrdersTableColumns>)[number]['name'][] = [
  'productUuid',
  'availableQuantity',
  'price',
  'locationUuid'
]

function getSellOrdersTableColumns(
  setOrderForPriceChart: (sellOrder: Order) => void
): Column<SellOrder>[] {
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
      name: 'availableQuantity',
      label: 'stock',
      type: 'number',
      isSortable: true,
      formatValue: FormattedQuantityForOrder,
    },
    {
      name: 'price',
      type: 'number',
      isSortable: true,
      sort: 'asc',
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

interface SellOrdersTableProps {
  searchFieldValue?: string
  sellOrderFilterValue?: SellOrderFilter
  setSellOrderFilterValue: Dispatch<SetStateAction<SellOrderFilter | undefined>>
  resetSearchFieldValue?: () => void
}
export const SellOrdersTable = memo(function SellOrdersTable({
  searchFieldValue,
  sellOrderFilterValue,
  setSellOrderFilterValue,
  resetSearchFieldValue,
}: SellOrdersTableProps) {
  const [isSellOrderCreation, setIsSellOrderCreation] = useState(false)
  const [sellOrderToEdit, setSellOrderToEdit] = useState<SellOrder>()
  const [sellOrderToDelete, setSellOrderToDelete] = useState<SellOrder>()

  const sellOrders = useSellOrdersStore(useShallow(state => state.items()))

  const isLoadingPersistStorages = useLoadingPersistStorages([useSellOrdersStore, useBuyOrdersStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const deleteMultipleSellOrders = useSellOrdersStore(state => state.deleteMultiple)

  const createMultipleBuyOrders = useBuyOrdersStore(state => state.createMultiple)

  const handleResetSellOrderFilterValue = useCallback(function handleResetSellOrderFilterValue() {
    setSellOrderFilterValue(undefined)
  }, [setSellOrderFilterValue])

  const handleShowCreateSellOrderModal = useCallback(function handleShowCreateSellOrderModal() {
    setIsSellOrderCreation(true)
  }, [setIsSellOrderCreation])

  const handleHideEditSellOrderModal = useCallback(function handleHideEditSellOrderModal() {
    setSellOrderToEdit(undefined)
    setIsSellOrderCreation(false)
  }, [setSellOrderToEdit, setIsSellOrderCreation])

  const handleShowDeleteSellOrderConfirmation = useCallback(function handleShowDeleteSellOrderConfirmation(item: SellOrder) {
    setSellOrderToDelete(item)
  }, [setSellOrderToDelete])

  const handleHideDeleteSellOrderConfirmation = useCallback(function handleHideDeleteSellOrderConfirmation() {
    setSellOrderToDelete(undefined)
  }, [setSellOrderToDelete])

  const [selectedOrderForPriceChart, setSelectedOrderForPriceChart] = useState<Order | undefined>(undefined)

  const handleSetOrderForPriceChart = useCallback(function handleSetOrderForPriceChart(sellOrder: Order) {
    setSelectedOrderForPriceChart(sellOrder)
  }, [setSelectedOrderForPriceChart])

  const handleUnsetOrderForPriceChart = useCallback(function handleUnsetOrderForPriceChart() {
    setSelectedOrderForPriceChart(undefined)
  }, [setSelectedOrderForPriceChart])

  const searchedSellOrders = useMemo(function searchedSellOrdersMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (!searchFieldValue) {
      return sellOrders
    }

    return sellOrders.filter(({ productUuid }) => {
      const existingProduct = getProductByUuidSelector(productUuid)

      if (!existingProduct) {
        return false
      }

      return existingProduct.name.includes(searchFieldValue)
    })
  }, [searchFieldValue, sellOrders, isLoading])

  const sellOrderFilterFields = useMemo(function sellOrderFilterFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    return getSellOrderFilterFields([])
  }, [isLoading])

  const {
    isAppliedFilter,
    enableFilter,
    disableFilter,
  } = useTableFilterApplyingToggler(sellOrderFilterValue)

  const filteredAndSearchedSellOrders = useTableFilter(
    searchedSellOrders,
    sellOrderFilterFields,
    isAppliedFilter ? sellOrderFilterValue : undefined
  )

  const filterInfoFields = useMemo(function filterInfoFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getOrdersTableFilterInfoFields()
  }, [isLoading])

  const sellOrdersTableColumns = useMemo(function sellOrdersTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getSellOrdersTableColumns(handleSetOrderForPriceChart)
  }, [handleSetOrderForPriceChart, isLoading])

  const {
    sortedItems: sortedAndFilteredAndSearchedSellOrders,
    columnsToSortBy: sellOrdersTableColumnsToSortBy,
    handleColumnSortClick: handleSellOrdersTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredAndSearchedSellOrders,
    sellOrdersTableColumns,
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
    itemTypeNamePlural: 'sell orders',
    items: sortedAndFilteredAndSearchedSellOrders,
    searchFieldValue,
    filterValue: sellOrderFilterValue,
    deleteItemsByUuids: deleteMultipleSellOrders,
    setItemToDelete: setSellOrderToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_SELL_ORDER,
    items: sortedAndFilteredAndSearchedSellOrders,
    searchFieldValue,
    filterValue: sellOrderFilterValue,
    resetFilterValue: handleResetSellOrderFilterValue,
    resetSearchFieldValue,
  })

  const findSimilarItemInTargetTable = useCallback(function findSimilarItemInTargetTable(sellOrder: SellOrder) {
    const existingSimilarItem = getBuyOrderByLocationUuidAndProductUuidSelector(sellOrder)

    return existingSimilarItem ? sellOrder : undefined
  }, [])

  const bulkItemsCopyingIntoTargetTable = useCallback(function bulkItemsCopyingIntoTargetTable(items: SellOrder[]) {
    const newBuyOrders = items.map((item) => {
      return {
        entityType: ENTITY_TYPE_BUY_ORDER,
        productUuid: item.productUuid,
        locationUuid: item.locationUuid,
        price: item.price,
        desirableQuantity: 0,
      } satisfies WithoutUUID<BuyOrder>
    })

    createMultipleBuyOrders(newBuyOrders)
  }, [createMultipleBuyOrders])

  const {
    CopySelectedItemsButton,
    CopyingDialog,
    ItemsWereCopiedNotification,
    NothingToCopyNotification,
  } = useCloneSelectedItems({
    items: sortedAndFilteredAndSearchedSellOrders,
    selectedItemsUuids,
    onBulkCopyingIntoTargetTable: bulkItemsCopyingIntoTargetTable,
    findSimilarItemInTargetTable: findSimilarItemInTargetTable,
    targetTableName: 'buy orders table',
  })

  return (
    <>
      <Table
        tableTitle="sell orders"
        tableColumns={sellOrdersTableColumns}
        items={sortedAndFilteredAndSearchedSellOrders}
        noItemsLabel="no sell orders"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add sell order"
        onShowCreateItemModal={handleShowCreateSellOrderModal}

        columnsToSortBy={sellOrdersTableColumnsToSortBy}
        onColumnHeaderClick={handleSellOrdersTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}

        filterValue={sellOrderFilterValue}
        isAppliedFilter={isAppliedFilter}
        onEnableFilter={enableFilter}
        onDisableFilter={disableFilter}
        filterInfoFields={filterInfoFields}

        CopySelectedItemsButton={CopySelectedItemsButton}
      >
        <TableBody
          items={sortedAndFilteredAndSearchedSellOrders}
          columns={sellOrdersTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setSellOrderToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isSellOrderCreation || !!sellOrderToEdit) && (
        <EditSellOrderModal
          itemToEdit={sellOrderToEdit}
          filterValue={sellOrderFilterValue}
          onHideModal={handleHideEditSellOrderModal}
          onShowDeleteItemConfirmation={handleShowDeleteSellOrderConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!sellOrderToDelete) && (
        <DeleteOrderConfirmation
          onHideModal={handleHideDeleteSellOrderConfirmation}
          onHideParentModal={handleHideEditSellOrderModal}
          itemToDelete={sellOrderToDelete}
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
