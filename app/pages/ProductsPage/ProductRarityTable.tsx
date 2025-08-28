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
import type { ProductRarity } from '../../models/entities/ProductRarity'
import { ENTITY_TYPE_PRODUCT_RARITY } from '../../models/entities/ProductRarity'
import { getUrlToProductsPageWithParams } from '../../router/urlSearchParams/getUrlToProductsPageWithParams'
import { useProductRaritiesStore } from '../../stores/entity-stores/ProductRarities.store'
import { DeleteProductRarityConfirmation } from './modals/DeleteProductRarityConfirmation'
import { EditProductRarityModal } from './modals/EditProductRarityModal'
import { useProductRaritiesTableSearch } from './useProductRaritiesTableSearch'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'
import { Icon } from '~/components/Icon'

const sortableGroupColumnNames: (typeof productRaritiesTableColumns)[number]['name'][] = [
  'name', 'value'
]

const productRaritiesTableColumns: Column<ProductRarity>[] = [
  {
    name: 'uuid',
    isCheckbox: true,
  },
  {
    name: `name`,
    asLinkToEditItem: true,
    isSortable: true,
    alignLabel: 'left',
    actionButtons: ({ item }) => {
      const urlToProductsPage = getUrlToProductsPageWithParams({
        productRarityName: item?.name,
      })

      return (
        <>
          {urlToProductsPage
            ? (
                <InternalStaticLink to={urlToProductsPage} title="search by product rarity in products">
                  <Icon name="search_category" />
                </InternalStaticLink>
              )
            : (
                <Button disabled noBorder noPadding transparent title="no data for search">
                  <Icon name="search_off" />
                </Button>
              )}
        </>
      )
    },
  },
  {
    name: 'value',
    type: 'number',
    isSortable: true,
    sort: 'asc',
  },
]

type AttributesAvailableForSearch = Pick<ProductRarity, 'name'>
const tableColumnsSuitableForSearch: (keyof Pick<ProductRarity, 'name'>)[] = ['name'] as const

const tableColumnsAvailableForSearch = productRaritiesTableColumns
  .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]

export const ProductRarityTable = memo(function ProductRarityTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductRaritiesStore])
  const isLoading = isLoadingPersistStorages

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useProductRaritiesTableSearch({ urlSearchParams, setUrlSearchParams })

  const productRarities = useProductRaritiesStore(useShallow(state => state.items()))
  const deleteMultipleProductRarities = useProductRaritiesStore(state => state.deleteMultiple)

  const [isProductRarityCreation, setIsProductRarityCreation] = useState(false)
  const [productRarityToEdit, setProductRarityToEdit] = useState<ProductRarity>()
  const [productRarityToDelete, setProductRarityToDelete] = useState<ProductRarity>()

  const handleShowCreateProductRarityModal = useCallback(() => {
    setIsProductRarityCreation(true)
  }, [setIsProductRarityCreation])

  const handleHideEditProductRarityModal = useCallback(() => {
    setProductRarityToEdit(undefined)
    setIsProductRarityCreation(false)
  }, [setProductRarityToEdit, setIsProductRarityCreation])

  const handleShowDeleteProductRarityConfirmation = useCallback((item: ProductRarity) => {
    setProductRarityToDelete(item)
  }, [setProductRarityToDelete])

  const handleHideDeleteProductRarityConfirmation = useCallback(() => {
    setProductRarityToDelete(undefined)
  }, [setProductRarityToDelete])

  const searchedProductRarities = useMemo(function searchedProductRaritiesMemo() {
    if (!searchFieldValue) {
      return productRarities
    }

    return productRarities.filter((item) => {
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
  }, [searchFieldValue, productRarities])

  const {
    sortedItems: sortedAndSearchedProductRarities,
    columnsToSortBy: productRaritiesTableColumnsToSortBy,
    handleColumnSortClick: handleProductRaritiesTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    searchedProductRarities,
    productRaritiesTableColumns,
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
    itemTypeNamePlural: 'product rarities',
    items: sortedAndSearchedProductRarities,
    searchFieldValue,
    deleteItemsByUuids: deleteMultipleProductRarities,
    setItemToDelete: setProductRarityToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_PRODUCT_RARITY,
    items: sortedAndSearchedProductRarities,
    searchFieldValue,
    resetSearchFieldValue,
  })

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>
        {SearchForm}
      </SearchAndFilterFormContainer>

      <Table
        tableTitle="product rarities"
        tableColumns={productRaritiesTableColumns}
        items={sortedAndSearchedProductRarities}
        noItemsLabel="no product rarities"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add product rarity"
        onShowCreateItemModal={handleShowCreateProductRarityModal}

        columnsToSortBy={productRaritiesTableColumnsToSortBy}
        onColumnHeaderClick={handleProductRaritiesTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}
      >
        <TableBody
          items={sortedAndSearchedProductRarities}
          columns={productRaritiesTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setProductRarityToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isProductRarityCreation || !!productRarityToEdit) && (
        <EditProductRarityModal
          itemToEdit={productRarityToEdit}
          onHideModal={handleHideEditProductRarityModal}
          onShowDeleteItemConfirmation={handleShowDeleteProductRarityConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!productRarityToDelete) && (
        <DeleteProductRarityConfirmation
          onHideModal={handleHideDeleteProductRarityConfirmation}
          onHideParentModal={handleHideEditProductRarityModal}
          itemToDelete={productRarityToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
