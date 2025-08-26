import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Button } from '../../components/Button'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { ColumnWithValue } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import { useTableFilter } from '../../components/tables/hooks/useTableFilter'
import { useTableFilterApplyingToggler } from '../../components/tables/hooks/useTableFilterApplyingToggler'
import type { Product } from '../../models/entities/Product'
import { ENTITY_TYPE_PRODUCT } from '../../models/entities/Product'
import { useProductRaritiesStore } from '../../stores/entity-stores/ProductRarities.store'
import { useProductTypesStore } from '../../stores/entity-stores/ProductTypes.store'
import { useProductsStore } from '../../stores/entity-stores/Products.store'
import { ProductFilterDialog } from '../LocationsPage/modals/ProductFilterDialog'
import { getProductFilterFields } from '../LocationsPage/modals/getProductFilterFields'
import styles from './ProductsTable.module.css'
import { getProductsTableFilterInfoFields } from './filterInfoFields/getProductsTableFilterInfoFields'
import { getProductsTableColumns } from './getProductsTableColumns'
import { DeleteProductConfirmation } from './modals/DeleteProductConfirmation'
import { EditProductModal } from './modals/EditProductModal'
import { useProductsTableFilter } from './useProductsTableFilter'
import { useProductsTableSearch } from './useProductsTableSearch'

const sortableGroupColumnNames: (ReturnType<typeof getProductsTableColumns>)[number]['name'][] = [
  'name',
  'productTypeUuid',
  'productRarityUuid',
]

type AttributesAvailableForSearch = Pick<Product, 'name'>
const tableColumnsSuitableForSearch: (keyof AttributesAvailableForSearch)[] = [
  'name'
] as const

const tableColumnsAvailableForSearch = getProductsTableColumns()
  .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]

export const ProductsTable = memo(function ProductsTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([
    useProductsStore,
    useProductTypesStore,
    useProductRaritiesStore
  ])
  const isLoading = isLoadingPersistStorages

  const {
    filterValue: productFilterValue,
    setFilterValueToUrlSearchParams
  } = useProductsTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useProductsTableSearch({ urlSearchParams, setUrlSearchParams })

  const products = useProductsStore(useShallow(state => state.items()))
  const deleteMultipleProducts = useProductsStore(state => state.deleteMultiple)

  const [isProductCreation, setIsProductCreation] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product>()
  const [productToDelete, setProductToDelete] = useState<Product>()

  const handleShowCreateProductModal = useCallback(() => {
    setIsProductCreation(true)
  }, [setIsProductCreation])

  const handleHideEditProductModal = useCallback(() => {
    setProductToEdit(undefined)
    setIsProductCreation(false)
  }, [setProductToEdit, setIsProductCreation])

  const handleShowDeleteProductConfirmation = useCallback((item: Product) => {
    setProductToDelete(item)
  }, [setProductToDelete])

  const handleHideDeleteProductConfirmation = useCallback(() => {
    setProductToDelete(undefined)
  }, [setProductToDelete])

  const searchedProducts = useMemo(function searchedLocationsMemo() {
    if (!searchFieldValue) {
      return products
    }

    return products.filter((item) => {
      const columnWithValue = tableColumnsAvailableForSearch.find((column) => {
        const itemAttributeValue = item[column.name]

        if (column.isSearchCaseInsensitive) {
          const itemAttributeValueAsLowerCase = itemAttributeValue?.toLocaleLowerCase()

          return itemAttributeValueAsLowerCase?.includes(searchFieldValue.toLocaleLowerCase())
        }

        return itemAttributeValue?.includes(searchFieldValue)
      })

      return !!columnWithValue
    })
  }, [searchFieldValue, products])

  const productFilterFields = useMemo(function productFilterFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getProductFilterFields([], [])
  }, [isLoading])

  const productFilterInfoFields = useMemo(function productFilterInfoFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getProductsTableFilterInfoFields()
  }, [isLoading])

  const {
    isAppliedFilter,
    enableFilter,
    disableFilter,
  } = useTableFilterApplyingToggler(productFilterValue)

  const filteredAndSearchedProducts = useTableFilter(
    searchedProducts,
    productFilterFields,
    isAppliedFilter ? productFilterValue : undefined
  )

  const productsTableColumns = useMemo(function productsTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getProductsTableColumns()
  }, [isLoading])

  const {
    sortedItems: sortedAndFilteredAndSearchedProducts,
    columnsToSortBy: productsTableColumnsToSortBy,
    handleColumnSortClick: handleProductTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredAndSearchedProducts,
    productsTableColumns,
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
    itemTypeNamePlural: 'products',
    items: sortedAndFilteredAndSearchedProducts,
    searchFieldValue,
    filterValue: productFilterValue,
    deleteItemsByUuids: deleteMultipleProducts,
    setItemToDelete: setProductToDelete,
  })

  const handleResetProductFilterValue = useCallback(function handleResetProductFilterValue() {
    setFilterValueToUrlSearchParams(undefined)
  }, [setFilterValueToUrlSearchParams])

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_PRODUCT,
    items: sortedAndFilteredAndSearchedProducts,
    searchFieldValue,
    filterValue: productFilterValue,
    resetSearchFieldValue,
    resetFilterValue: handleResetProductFilterValue,
  })

  const {
    isVisible: isVisibleFilterDialog,
    show: showFilterDialog,
    hide: hideFilerDialog,
  } = useIsVisible(false)

  useEffect(function hideProductFilterDialogWhenFilterValueChangesEffect() {
    // e.g. when dialog is open and user moving back or forth by navigation history
    if (productFilterValue || !productFilterValue) {
      hideFilerDialog()
    }
  }, [productFilterValue, hideFilerDialog])

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>

        {SearchForm}

        <Button
          onClick={showFilterDialog}
          title="show filter form"
        >
          <i className="icon icon-tune"></i>
          <span>filter</span>
        </Button>

        {isVisibleFilterDialog && (
          <ProductFilterDialog
            filterValue={productFilterValue}
            onSetFilterValue={setFilterValueToUrlSearchParams}
            onHide={hideFilerDialog}
          />
        )}
      </SearchAndFilterFormContainer>

      <div className={styles.Container}>
        <Table
          tableTitle="products"
          tableColumns={productsTableColumns}
          items={sortedAndFilteredAndSearchedProducts}
          noItemsLabel="no products"
          isLoading={isLoading}

          showCreateItemModalButtonLabel="add product"
          onShowCreateItemModal={handleShowCreateProductModal}

          columnsToSortBy={productsTableColumnsToSortBy}
          onColumnHeaderClick={handleProductTableColumnHeaderSortClick}

          selectedItemsUuids={selectedItemsUuids}
          onResetSelectedItems={handleResetSelectedItems}
          onSelectAllItems={handleSelectAllItems}
          onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

          searchFieldValue={searchFieldValue}

          filterValue={productFilterValue}
          isAppliedFilter={isAppliedFilter}
          onEnableFilter={enableFilter}
          onDisableFilter={disableFilter}
          filterInfoFields={productFilterInfoFields}
        >
          <TableBody
            items={sortedAndFilteredAndSearchedProducts}
            columns={productsTableColumns}
            selectedItemsUuids={selectedItemsUuids}
            onEditItem={setProductToEdit}
            onSelectItem={handleSelectItem}
            lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
          />
        </Table>
      </div>

      {(isProductCreation || !!productToEdit) && (
        <EditProductModal
          itemToEdit={productToEdit}
          filterValue={productFilterValue}
          onHideModal={handleHideEditProductModal}
          onShowDeleteItemConfirmation={handleShowDeleteProductConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!productToDelete) && (
        <DeleteProductConfirmation
          onHideModal={handleHideDeleteProductConfirmation}
          onHideParentModal={handleHideEditProductModal}
          itemToDelete={productToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
