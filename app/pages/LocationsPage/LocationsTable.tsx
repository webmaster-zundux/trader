import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'
import { useTableFilterApplyingToggler } from '~/components/tables/hooks/useTableFilterApplyingToggler'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Button } from '../../components/Button'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { ColumnWithValue } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import { useTableFilter } from '../../components/tables/hooks/useTableFilter'
import { ENTITY_TYPE_LOCATION, type Location } from '../../models/entities/Location'
import { useLocationsStore } from '../../stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '../../stores/entity-stores/PlanetarySystems.store'
import { getLocationsTableFilterInfoFields } from './filterInfoFields/getLocationsTableFilterInfoFields'
import { getLocationsTableColumns } from './getLocationsTableColumns'
import { DeleteLocationConfirmation } from './modals/DeleteLocationConfirmation'
import { EditLocationModal } from './modals/EditLocationModal'
import { LocationFilterDialog } from './modals/LocationFilterDialog'
import { getLocationFilterFields } from './modals/getLocationsFilterFields'
import { useLocationsTableFilter } from './useLocationsTableFilter'
import { useLocationsTableSearch } from './useLocationsTableSearch'

const sortableGroupColumnNames: (ReturnType<typeof getLocationsTableColumns>)[number]['name'][] = [
  'name',
  'planetarySystemUuid',
  'locationTypeUuid',
  'position',
]

type AttributesAvailableForSearch = Pick<Location, 'id' | 'name'>
const tableColumnsSuitableForSearch: (keyof Pick<Location, 'id' | 'name'>)[] = ['id', 'name'] as const

const tableColumnsAvailableForSearch = getLocationsTableColumns()
  .filter(column => ((tableColumnsSuitableForSearch as string[]).includes(column.name))) as ColumnWithValue<AttributesAvailableForSearch>[]

export const LocationsTable = memo(function LocationTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore, useLocationTypesStore])
  const isLoading = isLoadingPersistStorages

  const {
    filterValue: locationFilterValue,
    setFilterValueToUrlSearchParams,
  } = useLocationsTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useLocationsTableSearch({ urlSearchParams, setUrlSearchParams })

  const locations = useLocationsStore(useShallow(state => state.items()))
  const deleteMultipleLocations = useLocationsStore(state => state.deleteMultiple)

  const [isLocationCreation, setIsLocationCreation] = useState(false)
  const [locationToEdit, setLocationToEdit] = useState<Location>()
  const [locationToDelete, setLocationToDelete] = useState<Location>()

  const handleShowCreateLocationModal = useCallback(() => {
    setIsLocationCreation(true)
  }, [setIsLocationCreation])

  const handleHideEditLocationModal = useCallback(() => {
    setLocationToEdit(undefined)
    setIsLocationCreation(false)
  }, [setLocationToEdit, setIsLocationCreation])

  const handleShowDeleteLocationConfirmation = useCallback((item: Location) => {
    setLocationToDelete(item)
  }, [setLocationToDelete])

  const handleHideDeleteLocationConfirmation = useCallback(() => {
    setLocationToDelete(undefined)
  }, [setLocationToDelete])

  const searchedLocations = useMemo(function searchedLocationsMemo() {
    if (!searchFieldValue) {
      return locations
    }

    return locations.filter((item) => {
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
  }, [searchFieldValue, locations])

  const locationFilterFields = useMemo(function locationFilterFieldsMemo() {
    return getLocationFilterFields([], [])
  }, [])

  const locationFilterInfoFields = useMemo(function locationFilterInfoFieldsMemo() {
    return getLocationsTableFilterInfoFields()
  }, [])

  const {
    isAppliedFilter,
    enableFilter,
    disableFilter,
  } = useTableFilterApplyingToggler(locationFilterValue)

  const filteredAndSearchedLocations = useTableFilter(
    searchedLocations,
    locationFilterFields,
    isAppliedFilter ? locationFilterValue : undefined
  )

  const locationsTableColumns = useMemo(function locationsTableColumnsMemo() {
    return getLocationsTableColumns()
  }, [])

  const {
    sortedItems: sortedAndFilteredAndSearchedLocations,
    columnsToSortBy: locationsTableColumnsToSortBy,
    handleColumnSortClick: handleLocationsTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    filteredAndSearchedLocations,
    locationsTableColumns,
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
    itemTypeNamePlural: 'locations',
    items: sortedAndFilteredAndSearchedLocations,
    searchFieldValue,
    filterValue: locationFilterValue,
    deleteItemsByUuids: deleteMultipleLocations,
    setItemToDelete: setLocationToDelete,
  })

  const handleResetLocationFilterValue = useCallback(function handleResetLocationFilterValue() {
    setFilterValueToUrlSearchParams(undefined)
  }, [setFilterValueToUrlSearchParams])

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_LOCATION,
    items: sortedAndFilteredAndSearchedLocations,
    searchFieldValue,
    filterValue: locationFilterValue,
    resetSearchFieldValue,
    resetFilterValue: handleResetLocationFilterValue,
  })

  const {
    isVisible: isVisibleFilterDialog,
    show: showFilterDialog,
    hide: hideFilerDialog,
  } = useIsVisible(false)

  useEffect(function hideLocationFilterDialogWhenFilterValueChangesEffect() {
    // e.g. when dialog is open and user moving back or forth by navigation history
    if (locationFilterValue || !locationFilterValue) {
      hideFilerDialog()
    }
  }, [locationFilterValue, hideFilerDialog])

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>
        {SearchForm}

        <Button
          title="show filter form"
          onClick={showFilterDialog}
        >
          <i className="icon icon-tune"></i>
          <span>filter</span>
        </Button>

        {isVisibleFilterDialog && (
          <LocationFilterDialog
            filterValue={locationFilterValue}
            onSetFilterValue={setFilterValueToUrlSearchParams}
            onHide={hideFilerDialog}
          />
        )}
      </SearchAndFilterFormContainer>

      <Table
        tableTitle="locations"
        tableColumns={locationsTableColumns}
        items={sortedAndFilteredAndSearchedLocations}
        noItemsLabel="no locations"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add location"
        onShowCreateItemModal={handleShowCreateLocationModal}

        columnsToSortBy={locationsTableColumnsToSortBy}
        onColumnHeaderClick={handleLocationsTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}

        filterValue={locationFilterValue}
        isAppliedFilter={isAppliedFilter}
        onEnableFilter={enableFilter}
        onDisableFilter={disableFilter}
        filterInfoFields={locationFilterInfoFields}
      >
        <TableBody
          items={sortedAndFilteredAndSearchedLocations}
          columns={locationsTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setLocationToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isLocationCreation || !!locationToEdit) && (
        <EditLocationModal
          itemToEdit={locationToEdit}
          filterValue={locationFilterValue}
          onHideModal={handleHideEditLocationModal}
          onShowDeleteItemConfirmation={handleShowDeleteLocationConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!locationToDelete) && (
        <DeleteLocationConfirmation
          onHideModal={handleHideDeleteLocationConfirmation}
          onHideParentModal={handleHideEditLocationModal}
          itemToDelete={locationToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
