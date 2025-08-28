import { memo, useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { usePlanetarySystemsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/PlanetarySystemsAsSelectOptionArray.store'
import { SearchFormAndTableContainer } from '../../components/SearchFormAndTableContainer'
import { Table, TableBody } from '../../components/Table'
import { useItemsSelecting } from '../../components/tables/hooks/useItemsSelecting'
import { useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow } from '../../components/tables/hooks/useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow'
import { useSortableTableColumns } from '../../components/tables/hooks/useSortableTableColumns'
import type { PlanetarySystem } from '../../models/entities/PlanetarySystem'
import { ENTITY_TYPE_PLANETARY_SYSTEM } from '../../models/entities/PlanetarySystem'
import { usePlanetarySystemsStore } from '../../stores/entity-stores/PlanetarySystems.store'
import { getPlanetarySystemsTableColumns } from './getPlanetarySystemsTableColumns'
import { DeletePlanetarySystemConfirmation } from './modals/DeletePlanetarySystemConfirmation'
import { EditPlanetarySystemModal } from './modals/EditPlanetarySystemModal'
import { usePlanetarySystemsTableSearch } from './usePlanetarySystemsTableSearch'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'

const sortableGroupColumnNames: (ReturnType<typeof getPlanetarySystemsTableColumns>)[number]['name'][] = [
  'name',
  'position'
]

export const PlanetarySystemsTable = memo(function PlanetarySystemTable({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([usePlanetarySystemsAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const [isPlanetarySystemCreation, setIsPlanetarySystemCreation] = useState(false)
  const [planetarySystemToEdit, setPlanetarySystemToEdit] = useState<PlanetarySystem>()
  const [planetarySystemToDelete, setPlanetarySystemToDelete] = useState<PlanetarySystem>()

  const planetarySystems = usePlanetarySystemsStore(useShallow(state => state.items()))
  const deleteMultiplePlanetarySystems = usePlanetarySystemsStore(state => state.deleteMultiple)

  const handleShowCreatePlanetarySystemModal = useCallback(() => {
    setIsPlanetarySystemCreation(true)
  }, [setIsPlanetarySystemCreation])

  const handleHideEditPlanetarySystemModal = useCallback(() => {
    setPlanetarySystemToEdit(undefined)
    setIsPlanetarySystemCreation(false)
  }, [setPlanetarySystemToEdit, setIsPlanetarySystemCreation])

  const handleShowDeletePlanetarySystemConfirmation = useCallback((item: PlanetarySystem) => {
    setPlanetarySystemToDelete(item)
  }, [setPlanetarySystemToDelete])

  const handleHideDeletePlanetarySystemConfirmation = useCallback(() => {
    setPlanetarySystemToDelete(undefined)
  }, [setPlanetarySystemToDelete])

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = usePlanetarySystemsTableSearch({ urlSearchParams, setUrlSearchParams })

  const searchedPlanetarySystems = useMemo(() => {
    if (!searchFieldValue) {
      return planetarySystems
    }

    return planetarySystems
      .filter(({ name }) => name.includes(searchFieldValue))
  }, [searchFieldValue, planetarySystems])

  const planetarySystemsTableColumns = useMemo(function planetarySystemsTableColumnsMemo() {
    return getPlanetarySystemsTableColumns()
  }, [])

  const {
    sortedItems: sortedPlanetarySystems,
    columnsToSortBy: planetarySystemsTableColumnsToSortBy,
    handleColumnSortClick: handlePlanetarySystemsTableColumnHeaderSortClick,
  } = useSortableTableColumns(
    searchedPlanetarySystems,
    planetarySystemsTableColumns,
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
    itemTypeNamePlural: 'planetary systems',
    items: sortedPlanetarySystems,
    searchFieldValue,
    deleteItemsByUuids: deleteMultiplePlanetarySystems,
    setItemToDelete: setPlanetarySystemToDelete,
  })

  const {
    lastCreatedOrUpdatedItem,
    onCreateItem,
    onUpdateItem,
  } = useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow({
    itemEntityType: ENTITY_TYPE_PLANETARY_SYSTEM,
    items: sortedPlanetarySystems,
    searchFieldValue,
    resetSearchFieldValue,
  })

  return (
    <SearchFormAndTableContainer>

      <SearchAndFilterFormContainer>
        {SearchForm}
      </SearchAndFilterFormContainer>

      <Table
        tableTitle="planetary systems"
        tableColumns={planetarySystemsTableColumns}
        items={sortedPlanetarySystems}
        noItemsLabel="no planetary systems"
        isLoading={isLoading}

        showCreateItemModalButtonLabel="add planetary system"
        onShowCreateItemModal={handleShowCreatePlanetarySystemModal}

        columnsToSortBy={planetarySystemsTableColumnsToSortBy}
        onColumnHeaderClick={handlePlanetarySystemsTableColumnHeaderSortClick}

        selectedItemsUuids={selectedItemsUuids}
        onResetSelectedItems={handleResetSelectedItems}
        onSelectAllItems={handleSelectAllItems}
        onDeleteSelectedItems={handleShowDeleteMultipleSelectedItemsConfirmation}

        searchFieldValue={searchFieldValue}
      >
        <TableBody
          items={sortedPlanetarySystems}
          columns={planetarySystemsTableColumns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={setPlanetarySystemToEdit}
          onSelectItem={handleSelectItem}
          lastCreatedOrUpdatedItem={lastCreatedOrUpdatedItem}
        />
      </Table>

      {(isPlanetarySystemCreation || !!planetarySystemToEdit) && (
        <EditPlanetarySystemModal
          itemToEdit={planetarySystemToEdit}
          onHideModal={handleHideEditPlanetarySystemModal}
          onShowDeleteItemConfirmation={handleShowDeletePlanetarySystemConfirmation}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
        />
      )}

      {(!!planetarySystemToDelete) && (
        <DeletePlanetarySystemConfirmation
          onHideModal={handleHideDeletePlanetarySystemConfirmation}
          onHideParentModal={handleHideEditPlanetarySystemModal}
          itemToDelete={planetarySystemToDelete}
        />
      )}

      <DeleteSelectedItemsConfirmation />

    </SearchFormAndTableContainer>
  )
})
