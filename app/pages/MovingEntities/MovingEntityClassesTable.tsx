import { memo, useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { ENTITY_TYPE_MOVING_ENTITY_CLASS, type MovingEntityClass } from '~/models/entities/MovingEntityClass'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { ColumnWithValue } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import { getMovingEntityClassesTableColumns } from './getMovingEntityClassesTableColumns'
import { DeleteMovingEntityClassConfirmation } from './modals/DeleteMovingEntityClassConfirmation'
import { EditMovingEntityClassModal } from './modals/EditMovingEntityClassModal'
import { useMovingEntityClassesTableSearch } from './useMovingEntityClassesTableSearch'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'

const sortableGroupColumnNames: (ReturnType<typeof getMovingEntityClassesTableColumns>)[number]['name'][] = [
  'name',
]

type AttributesAvailableForSearch = Pick<MovingEntityClass, 'name'>
const tableColumnsSuitableForSearch: (keyof AttributesAvailableForSearch)[] = [
  'name',
] as const

const tableColumnsAvailableForSearch = getMovingEntityClassesTableColumns()
  .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]

export const MovingEntityClassesTable = memo(function MovingEntityTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore])
  const isLoading = isLoadingPersistStorages

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useMovingEntityClassesTableSearch({ urlSearchParams, setUrlSearchParams })

  const movingEntityClasses = useMovingEntityClassesStore(useShallow(state => state.items()))
  const deleteMultipleMovingEntityClass = useMovingEntityClassesStore(state => state.deleteMultiple)

  const [isMovingEntityClassCreation, setIsMovingEntityClassCreation] = useState(false)
  const [movingEntityClassToEdit, setMovingEntityClassToEdit] = useState<MovingEntityClass>()
  const [movingEntityClassToDelete, setMovingEntityClassToDelete] = useState<MovingEntityClass>()

  const handleShowCreateMovingEntityClassModal = useCallback(() => {
    setIsMovingEntityClassCreation(true)
  }, [setIsMovingEntityClassCreation])

  const handleHideEditMovingEntityClassModal = useCallback(() => {
    setMovingEntityClassToEdit(undefined)
    setIsMovingEntityClassCreation(false)
  }, [setMovingEntityClassToEdit, setIsMovingEntityClassCreation])

  const handleShowDeleteMovingEntityClassConfirmation = useCallback((item: MovingEntityClass) => {
    setMovingEntityClassToDelete(item)
  }, [setMovingEntityClassToDelete])

  const handleHideDeleteMovingEntityClassConfirmation = useCallback(() => {
    setMovingEntityClassToDelete(undefined)
  }, [setMovingEntityClassToDelete])

  const searchedMovingEntityClasses = useMemo(function searchedMovingEntityClassesMemo() {
    if (!searchFieldValue) {
      return movingEntityClasses
    }

    return movingEntityClasses.filter((item) => {
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
  }, [searchFieldValue, movingEntityClasses])

  const movingEntityClassesTableColumns = useMemo(function movingEntityClassesTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getMovingEntityClassesTableColumns()
  }, [isLoading])

  const {
    sortedItems: sortedAndSearchedMovingEntityClasses,
    columnsToSortBy: movingEntityClassesTableColumnsToSortBy,
    handleColumnSortClick: handleMovingEntityClassTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    searchedMovingEntityClasses,
    movingEntityClassesTableColumns,
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
    itemTypeNamePlural: 'moving object classes',
    items: sortedAndSearchedMovingEntityClasses,
    searchFieldValue,
    deleteItemsByUuids: deleteMultipleMovingEntityClass,
    setItemToDelete: setMovingEntityClassToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_MOVING_ENTITY_CLASS,
    items: sortedAndSearchedMovingEntityClasses,
    searchFieldValue,
    resetSearchFieldValue,
  })

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>
        {SearchForm}
      </SearchAndFilterFormContainer>

      <Table
        tableTitle="moving object classes"
        tableColumns={movingEntityClassesTableColumns}
        items={sortedAndSearchedMovingEntityClasses}
        noItemsLabel="no moving object classes"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add moving object class"
        onShowCreateItemModal={handleShowCreateMovingEntityClassModal}

        columnsToSortBy={movingEntityClassesTableColumnsToSortBy}
        onColumnHeaderClick={handleMovingEntityClassTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}
      >
        <TableBody
          items={sortedAndSearchedMovingEntityClasses}
          columns={movingEntityClassesTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setMovingEntityClassToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isMovingEntityClassCreation || !!movingEntityClassToEdit) && (
        <EditMovingEntityClassModal
          itemToEdit={movingEntityClassToEdit}
          onHideModal={handleHideEditMovingEntityClassModal}
          onShowDeleteItemConfirmation={handleShowDeleteMovingEntityClassConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!movingEntityClassToDelete) && (
        <DeleteMovingEntityClassConfirmation
          onHideModal={handleHideDeleteMovingEntityClassConfirmation}
          onHideParentModal={handleHideEditMovingEntityClassModal}
          itemToDelete={movingEntityClassToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
