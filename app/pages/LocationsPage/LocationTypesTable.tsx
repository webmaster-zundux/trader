import { memo, useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '~/components/Button'
import { SearchCategoryIcon } from '~/components/icons/SearchCategoryIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationTypesAsSelectOptionArray.store'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import type { Column } from '../../components/Table'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import type { LocationType } from '../../models/entities/LocationType'
import { ENTITY_TYPE_LOCATION_TYPE } from '../../models/entities/LocationType'
import { DeleteLocationTypeConfirmation } from './modals/DeleteLocationTypeConfirmation'
import { EditLocationTypeModal } from './modals/EditLocationTypeModal'
import { useLocationTypesTableSearch } from './useLocationTypesTableSearch'

const sortableGroupColumnNames: (typeof locationTypesTableColumns)[number]['name'][] = [
  'name',
]

const locationTypesTableColumns: Column<LocationType>[] = [
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
    actionButtons: function LocationTypeNameActionButtonsForLocationType({ item }) {
      const urlToProductsPage = getUrlToLocationsPageWithParams({
        locationTypeName: item?.name,
      })

      return (
        <>
          {urlToProductsPage
            ? (
              <InternalStaticLink to={urlToProductsPage} title="search by location type in locations">
                <SearchCategoryIcon />
              </InternalStaticLink>
            )
            : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <SearchOffIcon />
              </Button>
            )}
        </>
      )
    },
  },
]

export const LocationTypesTable = memo(function LocationTypeTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationTypesStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationTypesAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const [isLocationTypeCreation, setIsLocationTypeCreation] = useState(false)
  const [locationTypeToEdit, setLocationTypeToEdit] = useState<LocationType>()
  const [locationTypeToDelete, setLocationTypeToDelete] = useState<LocationType>()

  const locationTypes = useLocationTypesStore(useShallow(state => state.items()))
  const deleteMultipleLocationTypes = useLocationTypesStore(state => state.deleteMultiple)

  const handleShowCreateLocationTypeModal = useCallback(() => {
    setIsLocationTypeCreation(true)
  }, [setIsLocationTypeCreation])

  const handleHideEditLocationTypeModal = useCallback(() => {
    setLocationTypeToEdit(undefined)
    setIsLocationTypeCreation(false)
  }, [setLocationTypeToEdit, setIsLocationTypeCreation])

  const handleShowDeleteLocationTypeConfirmation = useCallback((item: LocationType) => {
    setLocationTypeToDelete(item)
  }, [setLocationTypeToDelete])

  const handleHideDeleteLocationTypeConfirmation = useCallback(() => {
    setLocationTypeToDelete(undefined)
  }, [setLocationTypeToDelete])

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useLocationTypesTableSearch({ urlSearchParams, setUrlSearchParams })

  const searchedLocationTypes = useMemo(() => {
    if (!searchFieldValue) {
      return locationTypes
    }

    return locationTypes
      .filter(({ name }) => name.includes(searchFieldValue))
  }, [searchFieldValue, locationTypes])

  const {
    sortedItems: sortedLocationTypes,
    columnsToSortBy: locationTypesTableColumnsToSortBy,
    handleColumnSortClick: handleLocationTypesTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    searchedLocationTypes,
    locationTypesTableColumns,
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
    itemTypeNamePlural: 'location types',
    items: sortedLocationTypes,
    searchFieldValue,
    deleteItemsByUuids: deleteMultipleLocationTypes,
    setItemToDelete: setLocationTypeToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_LOCATION_TYPE,
    items: sortedLocationTypes,
    searchFieldValue,
    resetSearchFieldValue,
  })

  return (
    <SearchFormAndTableContainer>

      {SearchForm}

      <Table
        tableTitle="location types"
        tableColumns={locationTypesTableColumns}
        items={sortedLocationTypes}
        noItemsLabel="no location types"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add location type"
        onShowCreateItemModal={handleShowCreateLocationTypeModal}

        columnsToSortBy={locationTypesTableColumnsToSortBy}
        onColumnHeaderClick={handleLocationTypesTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}
      >
        <TableBody
          items={sortedLocationTypes}
          columns={locationTypesTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setLocationTypeToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isLocationTypeCreation || !!locationTypeToEdit) && (
        <EditLocationTypeModal
          itemToEdit={locationTypeToEdit}
          onHideModal={handleHideEditLocationTypeModal}
          onShowDeleteItemConfirmation={handleShowDeleteLocationTypeConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!locationTypeToDelete) && (
        <DeleteLocationTypeConfirmation
          onHideModal={handleHideDeleteLocationTypeConfirmation}
          onHideParentModal={handleHideEditLocationTypeModal}
          itemToDelete={locationTypeToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
