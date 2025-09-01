import { memo, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { getFlatFormFields } from '~/components/forms/FormFieldWithLabel.const'
import { Table, TableBody, type Column } from '~/components/Table'
import { useSortableTableColumns } from '~/components/tables/hooks/useSortableTableColumns'
import { useTableFilter } from '~/components/tables/hooks/useTableFilter'
import type { MapOrderPricesFilter } from '~/models/entities-filters/MapOrderPricesFilter'
import { FormattedLocationFullName } from '~/pages/MarketPage/tables/FormattedCells/FormattedLocationFullName'
import { FormattedPriceForOrder } from '~/pages/MarketPage/tables/FormattedCells/FormattedPriceForOrder'
import { FormattedProductNameForOrder } from '~/pages/MarketPage/tables/FormattedCells/FormattedProductNameForOrder'
import { FormattedQuantityForOrder } from '~/pages/MarketPage/tables/FormattedCells/FormattedQuantityForOrder'
import { LocationActionButtonsForOrder } from '~/pages/MarketPage/tables/FormattedCells/LocationActionButtonsForOrder'
import { ProductActionButtonsForOrder } from '~/pages/MarketPage/tables/FormattedCells/ProductActionButtonsForOrder'
import { sortItemsByLocationFullName } from '~/pages/MarketPage/tables/sortBy/sortItemsByLocationFullNameForOrder'
import { sortItemsByProductName } from '~/pages/MarketPage/tables/sortBy/sortItemsByProductName'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import type { SellOrder } from '../../../models/entities/SellOrder'
import { useProductsStore } from '../../../stores/entity-stores/Products.store'
import { useSellOrdersStore } from '../../../stores/entity-stores/SellOrders.store'
import { getMapOrderPricesFilterFields } from '../getMapOrderPricesFilterFields'

const sortableGroupColumnNames: (ReturnType<typeof getMapSellOrderPricesTableColumns>)[number]['name'][] = [
  'productUuid',
  'availableQuantity',
  'price',
  'locationUuid'
]

function getMapSellOrderPricesTableColumns(
  // setOrderForPriceChart: (sellOrder: Order) => void
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
      // actionButtons: ({ item }) => <PriceActionButtonsForOrder item={item} setOrderForPriceChart={setOrderForPriceChart} />,
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

interface MapSellOrderPricesTableProps {
  // searchFieldValue?: string
  sellOrderFilterValue?: MapOrderPricesFilter
  // setSellOrderFilterValue: Dispatch<SetStateAction<SellOrderFilter | undefined>>
  // resetSearchFieldValue?: () => void
}
export const MapSellOrderPricesTable = memo(function MapSellOrderPricesTable({
  // searchFieldValue,
  sellOrderFilterValue,
  // setSellOrderFilterValue,
  // resetSearchFieldValue,
}: MapSellOrderPricesTableProps) {
  // const [isSellOrderCreation, setIsSellOrderCreation] = useState(false)
  // const [sellOrderToEdit, setSellOrderToEdit] = useState<SellOrder>()
  // const [sellOrderToDelete, setSellOrderToDelete] = useState<SellOrder>()

  const sellOrders = useSellOrdersStore(useShallow(state => state.items()))

  const isLoadingPersistStorages = useLoadingPersistStorages([useSellOrdersStore, useProductsStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  // const deleteMultipleSellOrders = useSellOrdersStore(state => state.deleteMultiple)

  // const createMultipleBuyOrders = useBuyOrdersStore(state => state.createMultiple)

  // const handleResetSellOrderFilterValue = useCallback(function handleResetSellOrderFilterValue() {
  //   setSellOrderFilterValue(undefined)
  // }, [setSellOrderFilterValue])

  // const handleShowCreateSellOrderModal = useCallback(function handleShowCreateSellOrderModal() {
  //   setIsSellOrderCreation(true)
  // }, [setIsSellOrderCreation])

  // const handleHideEditSellOrderModal = useCallback(function handleHideEditSellOrderModal() {
  //   setSellOrderToEdit(undefined)
  //   setIsSellOrderCreation(false)
  // }, [setSellOrderToEdit, setIsSellOrderCreation])

  // const handleShowDeleteSellOrderConfirmation = useCallback(function handleShowDeleteSellOrderConfirmation(item: SellOrder) {
  //   setSellOrderToDelete(item)
  // }, [setSellOrderToDelete])

  // const handleHideDeleteSellOrderConfirmation = useCallback(function handleHideDeleteSellOrderConfirmation() {
  //   setSellOrderToDelete(undefined)
  // }, [setSellOrderToDelete])

  // const [selectedOrderForPriceChart, setSelectedOrderForPriceChart] = useState<Order | undefined>(undefined)

  // const handleSetOrderForPriceChart = useCallback(function handleSetOrderForPriceChart(sellOrder: Order) {
  //   setSelectedOrderForPriceChart(sellOrder)
  // }, [setSelectedOrderForPriceChart])

  // const handleUnsetOrderForPriceChart = useCallback(function handleUnsetOrderForPriceChart() {
  //   setSelectedOrderForPriceChart(undefined)
  // }, [setSelectedOrderForPriceChart])

  // const searchedSellOrders = useMemo(function searchedSellOrdersMemo() {
  //   if (isLoading || !isLoading) {
  //     // noop - just tracking isLoading updates
  //   }

  //   if (!searchFieldValue) {
  //     return sellOrders
  //   }

  //   return sellOrders.filter(({ productUuid }) => {
  //     const existingProduct = getProductByUuidSelector(productUuid)

  //     if (!existingProduct) {
  //       return false
  //     }

  //     return existingProduct.name.includes(searchFieldValue)
  //   })
  // }, [searchFieldValue, sellOrders, isLoading])

  const mapOrderPricesFilterFields = useMemo(function mapSellOrderPricesFilterFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const originalFilterFields = getMapOrderPricesFilterFields({
      productsAsSelectOptions: [],
      locationsAsSelectOptions: []
    })

    return getFlatFormFields(originalFilterFields)
  }, [isLoading])

  // const {
  //   isAppliedFilter,
  //   enableFilter,
  //   disableFilter,
  // } = useTableFilterApplyingToggler(sellOrderFilterValue)

  const filteredSellOrders = useTableFilter(
    sellOrders,
    mapOrderPricesFilterFields,
    // isAppliedFilter ? sellOrderFilterValue : undefined
    sellOrderFilterValue
  )

  // const filterInfoFields = useMemo(function filterInfoFieldsMemo() {
  //   if (isLoading || !isLoading) {
  //     // noop - just tracking isLoading updates
  //   }
  //   return getOrdersTableFilterInfoFields()
  // }, [isLoading])

  const mapSellOrderPricesTableColumns = useMemo(function mapSellOrderPricesTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    // return getMapSellOrderPricesTableColumns(handleSetOrderForPriceChart)
    return getMapSellOrderPricesTableColumns()
    // }, [handleSetOrderForPriceChart, isLoading])
  }, [isLoading])

  const {
    sortedItems: sortedAndFilteredSellOrders,
    columnsToSortBy: sellOrdersTableColumnsToSortBy,
    handleColumnSortClick: handleSellOrdersTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredSellOrders,
    mapSellOrderPricesTableColumns,
    sortableGroupColumnNames
  )

  // const {
  //   selectedItemsUuids,
  //   handleResetSelectedItems,
  //   handleSelectAllItems,
  //   handleSelectItem,
  //   handleShowDeleteMultipleSelectedItemsConfirmation,
  //   DeleteSelectedItemsConfirmation,
  // } = useItemsSelecting({
  //   itemTypeNamePlural: 'sell orders',
  //   items: sortedAndFilteredSellOrders,
  //   searchFieldValue,
  //   filterValue: sellOrderFilterValue,
  //   deleteItemsByUuids: deleteMultipleSellOrders,
  //   setItemToDelete: setSellOrderToDelete,
  // })

  // const {
  //   lastCreatedOrUpdatedItem,
  //   onCreateItem,
  //   onUpdateItem,
  // } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
  //   itemEntityType: ENTITY_TYPE_SELL_ORDER,
  //   items: sortedAndFilteredSellOrders,
  //   searchFieldValue,
  //   filterValue: sellOrderFilterValue,
  //   resetFilterValue: handleResetSellOrderFilterValue,
  //   resetSearchFieldValue,
  // })

  // const findSimilarItemInTargetTable = useCallback(function findSimilarItemInTargetTable(sellOrder: SellOrder) {
  //   const existingSimilarItem = getBuyOrderByLocationUuidAndProductUuidSelector(sellOrder)

  //   return existingSimilarItem ? sellOrder : undefined
  // }, [])

  // const bulkItemsCopyingIntoTargetTable = useCallback(function bulkItemsCopyingIntoTargetTable(items: SellOrder[]) {
  //   const newBuyOrders = items.map((item) => {
  //     return {
  //       entityType: ENTITY_TYPE_BUY_ORDER,
  //       productUuid: item.productUuid,
  //       locationUuid: item.locationUuid,
  //       price: item.price,
  //       desirableQuantity: 0,
  //     } satisfies WithoutUUID<BuyOrder>
  //   })

  //   createMultipleBuyOrders(newBuyOrders)
  // }, [createMultipleBuyOrders])

  // const {
  //   CopySelectedItemsButton,
  //   CopyingDialog,
  //   ItemsWereCopiedNotification,
  //   NothingToCopyNotification,
  // } = useCloneSelectedItems({
  //   items: sortedAndFilteredSellOrders,
  //   selectedItemsUuids,
  //   onBulkCopyingIntoTargetTable: bulkItemsCopyingIntoTargetTable,
  //   findSimilarItemInTargetTable: findSimilarItemInTargetTable,
  //   targetTableName: 'buy orders table',
  // })

  return (
    <>
      <Table
        tableTitle="sell orders"
        tableColumns={mapSellOrderPricesTableColumns}
        items={sortedAndFilteredSellOrders}
        noItemsLabel="no sell orders"
        isLoading={isLoading}

        // showCreateItemModalButtonLabel="add sell order"
        // onShowCreateItemModal={handleShowCreateSellOrderModal}

        columnsToSortBy={sellOrdersTableColumnsToSortBy}
        onColumnHeaderClick={handleSellOrdersTableColumnHeaderSortClick}

        // selectedItemsUuids={selectedItemsUuids}
        // onResetSelectedItems={handleResetSelectedItems}
        // onSelectAllItems={handleSelectAllItems}
        // onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        // searchFieldValue={searchFieldValue}

        filterValue={sellOrderFilterValue}
        // isAppliedFilter={isAppliedFilter}
        // onEnableFilter={enableFilter}
        // onDisableFilter={disableFilter}
        // filterInfoFields={filterInfoFields}

        // CopySelectedItemsButton={CopySelectedItemsButton}
      >
        <TableBody
          items={sortedAndFilteredSellOrders}
          columns={mapSellOrderPricesTableColumns}
        // selectedItemsUuids={selectedItemsUuids}
        // onEditItem={setSellOrderToEdit}
        // onSelectItem={handleSelectItem}
        // lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {/* {(isSellOrderCreation || !!sellOrderToEdit) && (
        <EditSellOrderModal
          itemToEdit={sellOrderToEdit}
          filterValue={sellOrderFilterValue}
          onHideModal={handleHideEditSellOrderModal}
          onShowDeleteItemConfirmation={handleShowDeleteSellOrderConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )} */}

      {/* {(!!sellOrderToDelete) && (
        <DeleteOrderConfirmation
          onHideModal={handleHideDeleteSellOrderConfirmation}
          onHideParentModal={handleHideEditSellOrderModal}
          itemToDelete={sellOrderToDelete}
        />
      )} */}

      {/* <DeleteSelectedItemsConfirmation /> */}

      {/* <CopyingDialog /> */}
      {/* {ItemsWereCopiedNotification()} */}
      {/* {NothingToCopyNotification()} */}

      {/* {!!selectedOrderForPriceChart && (
        <OrderPriceHistoryPlotModal
          order={selectedOrderForPriceChart}
          onHideModal={handleUnsetOrderForPriceChart}
        />
      )} */}
    </>
  )
})
