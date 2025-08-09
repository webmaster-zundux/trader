import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '~/components/Button'
import { TuneIcon } from '~/components/icons/TuneIcon'
import { useTableFilter } from '~/components/tables/hooks/useTableFilter'
import { useTableFilterApplyingToggler } from '~/components/tables/hooks/useTableFilterApplyingToggler'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { ColumnWithValue } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import { ENTITY_TYPE_MOVING_ENTITY, type MovingEntity } from '../../models/entities/MovingEntity'
import { usePlanetarySystemsStore } from '../../stores/entity-stores/PlanetarySystems.store'
import { getMovingEntitiesTableFilterInfoFields } from './filterInfoFields/getMovingEntitiesTableFilterInfoFields'
import { getMovingEntitiesTableColumns } from './getMovingEntitiesTableColumns'
import { getMovingEntityFilterFields } from './getMovingEntityFilterFields'
import { DeleteMovingEntityConfirmation } from './modals/DeleteMovingEntityConfirmation'
import { EditMovingEntityModal } from './modals/EditMovingEntityModal'
import { MovingEntityFilterDialog } from './modals/MovingEntityFilterDialog'
import styles from './MovingEntitiesTable.module.css'
import { useMovingEntitiesTableFilter } from './useMovingEntitiesTableFilter'
import { useMovingEntitiesTableSearch } from './useMovingEntitiesTableSearch'

const sortableGroupColumnNames: (ReturnType<typeof getMovingEntitiesTableColumns>)[number]['name'][] = [
  'name',
  'id',
  'originalId',

  'movingEntityClassUuid',

  'locationUuid',
  'homeLocationUuid',
  'destinationLocationUuid',
  'combatShield',
  'combatLaser',
  'combatMissiles'
]

type AttributesAvailableForSearch = Pick<MovingEntity, 'name' | 'id' | 'originalId'>
const tableColumnsSuitableForSearch: (keyof AttributesAvailableForSearch)[] = [
  'name',
  'id',
  'originalId'
] as const

export const MovingEntitiesTable = memo(function MovingEntityTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([
    useMovingEntitiesStore,
    useMovingEntityClassesStore,
    usePlanetarySystemsStore,
    useLocationsStore,
  ])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([
    useLocationsWithFullNameAsMapStore,
  ])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const {
    filterValue: movingEntityFilterValue,
    setFilterValueToUrlSearchParams
  } = useMovingEntitiesTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useMovingEntitiesTableSearch({ urlSearchParams, setUrlSearchParams })

  const movingEntities = useMovingEntitiesStore(useShallow(state => state.items()))
  const deleteMultipleMovingEntity = useMovingEntitiesStore(state => state.deleteMultiple)

  const [isMovingEntityCreation, setIsMovingEntityCreation] = useState(false)
  const [movingEntityToEdit, setMovingEntityToEdit] = useState<MovingEntity>()
  const [movingEntityToDelete, setMovingEntityToDelete] = useState<MovingEntity>()

  const handleShowCreateMovingEntityModal = useCallback(() => {
    setIsMovingEntityCreation(true)
  }, [setIsMovingEntityCreation])

  const handleHideEditMovingEntityModal = useCallback(() => {
    setMovingEntityToEdit(undefined)
    setIsMovingEntityCreation(false)
  }, [setMovingEntityToEdit, setIsMovingEntityCreation])

  const handleShowDeleteMovingEntityConfirmation = useCallback((item: MovingEntity) => {
    setMovingEntityToDelete(item)
  }, [setMovingEntityToDelete])

  const handleHideDeleteMovingEntityConfirmation = useCallback(() => {
    setMovingEntityToDelete(undefined)
  }, [setMovingEntityToDelete])

  const tableColumnsAvailableForSearch = useMemo(function tableColumnsAvailableForSearchMemo() {
    return getMovingEntitiesTableColumns()
      .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]
  }, [])

  const searchedMovingEntities = useMemo(function searchedMovingEntitiesMemo() {
    if (!searchFieldValue) {
      return movingEntities
    }

    return movingEntities.filter((item) => {
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
  }, [searchFieldValue, movingEntities, tableColumnsAvailableForSearch])

  const movingEntityFilterFields = useMemo(function movingEntityFilterFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getMovingEntityFilterFields([], [])
  }, [isLoading])

  const movingEntityFilterInfoFields = useMemo(function movingEntityFilterInfoFieldsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getMovingEntitiesTableFilterInfoFields()
  }, [isLoading])

  const {
    isAppliedFilter,
    enableFilter,
    disableFilter,
  } = useTableFilterApplyingToggler(movingEntityFilterValue)

  const filteredAndSearchedMovingEntities = useTableFilter(
    searchedMovingEntities,
    movingEntityFilterFields,
    isAppliedFilter ? movingEntityFilterValue : undefined
  )

  const movingEntitiesTableColumns = useMemo(function movingEntitiesTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getMovingEntitiesTableColumns()
  }, [isLoading])

  const {
    sortedItems: sortedAndFilteredAndSearchedMovingEntities,
    columnsToSortBy: movingEntitiesTableColumnsToSortBy,
    handleColumnSortClick: handleMovingEntityTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredAndSearchedMovingEntities,
    movingEntitiesTableColumns,
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
    itemTypeNamePlural: 'moving objects',
    items: sortedAndFilteredAndSearchedMovingEntities,
    searchFieldValue,
    filterValue: movingEntityFilterValue,
    deleteItemsByUuids: deleteMultipleMovingEntity,
    setItemToDelete: setMovingEntityToDelete,
  })

  const handleResetMovingEntityFilterValue = useCallback(function handleResetMovingEntityFilterValue() {
    setFilterValueToUrlSearchParams(undefined)
  }, [setFilterValueToUrlSearchParams])

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_MOVING_ENTITY,
    items: sortedAndFilteredAndSearchedMovingEntities,
    searchFieldValue,
    filterValue: movingEntityFilterValue,
    resetSearchFieldValue,
    resetFilterValue: handleResetMovingEntityFilterValue,
  })

  const {
    isVisible: isVisibleFilterDialog,
    show: showFilterDialog,
    hide: hideFilerDialog,
  } = useIsVisible(false)

  useEffect(function hideMovingEntityFilterDialogWhenFilterValueChangesEffect() {
    // e.g. when dialog is open and user moving back or forth by navigation history
    if (movingEntityFilterValue || !movingEntityFilterValue) {
      hideFilerDialog()
    }
  }, [movingEntityFilterValue, hideFilerDialog])

  return (
    <SearchFormAndTableContainer>

      <div className={styles.SearchAndFilterFormContainer}>

        {SearchForm}

        <Button onClick={showFilterDialog} title="show filter form">
          <TuneIcon />
          <span>filter</span>
        </Button>

        {isVisibleFilterDialog && (
          <MovingEntityFilterDialog
            filterValue={movingEntityFilterValue}
            onSetFilterValue={setFilterValueToUrlSearchParams}
            onHide={hideFilerDialog}
          />
        )}
      </div>

      <div className={styles.Container}>
        <Table
          tableTitle="moving objects"
          tableColumns={movingEntitiesTableColumns}
          items={sortedAndFilteredAndSearchedMovingEntities}
          noItemsLabel="no moving objects"
          isLoading={isLoading}

          showCreateItemModalButtonLabel="add moving object"
          onShowCreateItemModal={handleShowCreateMovingEntityModal}

          columnsToSortBy={movingEntitiesTableColumnsToSortBy}
          onColumnHeaderClick={handleMovingEntityTableColumnHeaderSortClick}

          selectedItemsUuids={selectedItemsUuids}
          onResetSelectedItems={handleResetSelectedItems}
          onSelectAllItems={handleSelectAllItems}
          onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

          searchFieldValue={searchFieldValue}

          filterValue={movingEntityFilterValue}
          isAppliedFilter={isAppliedFilter}
          onEnableFilter={enableFilter}
          onDisableFilter={disableFilter}
          filterInfoFields={movingEntityFilterInfoFields}
        >
          <TableBody
            items={sortedAndFilteredAndSearchedMovingEntities}
            columns={movingEntitiesTableColumns}
            selectedItemsUuids={selectedItemsUuids}
            onEditItem={setMovingEntityToEdit}
            onSelectItem={handleSelectItem}
            lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
          />
        </Table>
      </div>

      {(isMovingEntityCreation || !!movingEntityToEdit) && (
        <EditMovingEntityModal
          itemToEdit={movingEntityToEdit}
          filterValue={movingEntityFilterValue}
          onHideModal={handleHideEditMovingEntityModal}
          onShowDeleteItemConfirmation={handleShowDeleteMovingEntityConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!movingEntityToDelete) && (
        <DeleteMovingEntityConfirmation
          onHideModal={handleHideDeleteMovingEntityConfirmation}
          onHideParentModal={handleHideEditMovingEntityModal}
          itemToDelete={movingEntityToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
