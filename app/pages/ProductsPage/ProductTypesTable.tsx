import { memo, useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Button } from '../../components/Button'
import { InternalStaticLink } from '../../components/InternalStaticLink'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { Column, ColumnWithValue } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import type { ProductType } from '../../models/entities/ProductType'
import { ENTITY_TYPE_PRODUCT_TYPE } from '../../models/entities/ProductType'
import { getUrlToProductsPageWithParams } from '../../router/urlSearchParams/getUrlToProductsPageWithParams'
import { useProductTypesStore } from '../../stores/entity-stores/ProductTypes.store'
import { DeleteProductTypeConfirmation } from './modals/DeleteProductTypeConfirmation'
import { EditProductTypeModal } from './modals/EditProductTypeModal'
import { useProductTypesTableSearch } from './useProductTypesTableSearch'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'

const sortableGroupColumnNames: (typeof productTypesTableColumns)[number]['name'][] = [
  'name',
]

const productTypesTableColumns: Column<ProductType>[] = [
  {
    name: 'uuid',
    isCheckbox: true,
  },
  {
    name: 'name',
    asLinkToEditItem: true,
    isSortable: true,
    sort: 'asc',
    alignLabel: 'left',
    actionButtons: function ProductTypeNameActionButtonsForProductType({ item }) {
      const urlToProductsPage = getUrlToProductsPageWithParams({
        productTypeName: item?.name,
      })

      return (
        <>
          {urlToProductsPage
            ? (
              <InternalStaticLink to={urlToProductsPage} title="search by product type in products">
                <i className="icon icon-search_category"></i>
              </InternalStaticLink>
            )
            : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-search_off"></i>
              </Button>
            )}
        </>
      )
    },
  },
]

type AttributesAvailableForSearch = Pick<ProductType, 'name'>
const tableColumnsSuitableForSearch: (keyof Pick<ProductType, 'name'>)[] = ['name'] as const

const tableColumnsAvailableForSearch = productTypesTableColumns
  .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]

export const ProductTypesTable = memo(function ProductTypesTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore])
  const isLoading = isLoadingPersistStorages

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useProductTypesTableSearch({ urlSearchParams, setUrlSearchParams })

  const productTypes = useProductTypesStore(useShallow(state => state.items()))
  const deleteMultipleProductTypes = useProductTypesStore(state => state.deleteMultiple)

  const [isProductTypeCreation, setIsProductTypeCreation] = useState(false)
  const [productTypeToEdit, setProductTypeToEdit] = useState<ProductType>()
  const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType>()

  const handleShowCreateProductTypeModal = useCallback(() => {
    setIsProductTypeCreation(true)
  }, [setIsProductTypeCreation])

  const handleHideEditProductTypeModal = useCallback(() => {
    setProductTypeToEdit(undefined)
    setIsProductTypeCreation(false)
  }, [setProductTypeToEdit, setIsProductTypeCreation])

  const handleShowDeleteProductTypeConfirmation = useCallback((item: ProductType) => {
    setProductTypeToDelete(item)
  }, [setProductTypeToDelete])

  const handleHideDeleteProductTypeConfirmation = useCallback(() => {
    setProductTypeToDelete(undefined)
  }, [setProductTypeToDelete])

  const searchedProductTypes = useMemo(function searchedProductTypesMemo() {
    if (!searchFieldValue) {
      return productTypes
    }

    return productTypes.filter((item) => {
      const columnWithValue = tableColumnsAvailableForSearch.find((column) => {
        let itemAttributeValue = item[column.name]

        if (column.isSearchCaseInsensitive) {
          itemAttributeValue = itemAttributeValue?.toLocaleLowerCase()
          return itemAttributeValue?.includes(searchFieldValue.toLocaleLowerCase())
        }

        return itemAttributeValue?.includes(searchFieldValue)
      })

      return !!columnWithValue
    })
  }, [searchFieldValue, productTypes])

  const {
    sortedItems: sortedAndSearchedProductTypes,
    columnsToSortBy: productTypesTableColumnsToSortBy,
    handleColumnSortClick: handleProductTypesTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    searchedProductTypes,
    productTypesTableColumns,
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
    itemTypeNamePlural: 'product types',
    items: sortedAndSearchedProductTypes,
    searchFieldValue,
    deleteItemsByUuids: deleteMultipleProductTypes,
    setItemToDelete: setProductTypeToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_PRODUCT_TYPE,
    items: sortedAndSearchedProductTypes,
    searchFieldValue,
    resetSearchFieldValue,
  })

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>
        {SearchForm}
      </SearchAndFilterFormContainer>

      <Table
        tableTitle="product types"
        tableColumns={productTypesTableColumns}
        items={sortedAndSearchedProductTypes}
        noItemsLabel="no product types"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add product type"
        onShowCreateItemModal={handleShowCreateProductTypeModal}

        columnsToSortBy={productTypesTableColumnsToSortBy}
        onColumnHeaderClick={handleProductTypesTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}
      >
        <TableBody
          items={sortedAndSearchedProductTypes}
          columns={productTypesTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setProductTypeToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isProductTypeCreation || !!productTypeToEdit) && (
        <EditProductTypeModal
          itemToEdit={productTypeToEdit}
          onHideModal={handleHideEditProductTypeModal}
          onShowDeleteItemConfirmation={handleShowDeleteProductTypeConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!productTypeToDelete) && (
        <DeleteProductTypeConfirmation
          onHideModal={handleHideDeleteProductTypeConfirmation}
          onHideParentModal={handleHideEditProductTypeModal}
          itemToDelete={productTypeToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
