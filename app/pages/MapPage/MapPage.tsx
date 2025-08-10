import { memo, useCallback, useMemo } from 'react'
import { SearchFormAndTableContainer } from '~/components/SearchFormAndTableContainer'
import { SearchResultsTable, SearchResultsTableBody } from '~/components/SearchResultsTable'
import { useSearchParams } from '~/hooks/useSearchParams'
import { isLocation, type Location } from '~/models/entities/Location'
import { isMovingEntity, type MovingEntity } from '~/models/entities/MovingEntity'
import { isPlanetarySystem, type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Map } from './Map'
import { MAP_MODE_PLANETARY_SYSTEM, MAP_MODE_UNIVERSE } from './Map.const'
import styles from './MapPage.module.css'
import { getSearchResultTableColumns } from './getSearchResultTableColumns'
import { useGetMapItems } from './hooks/useGetMapItems'
import { useGetMapSearchResults } from './hooks/useGetMapSearchResults'
import { useMapFilter } from './useMapFilter'
import { useMapPageTitle } from './useMapPageTitle'
import { useMapSearch } from './useMapSearch'

export const MapPage = memo(function MapPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const pageTitle = useMapPageTitle(urlSearchParams)

  const { mapFilterValue, setMapFilterValueToUrlSearchParams } = useMapFilter({ urlSearchParams, setUrlSearchParams })

  const {
    SearchForm,
    searchFieldValue,
  } = useMapSearch({
    urlSearchParams,
    setUrlSearchParams,
  })

  const isLoadingPersistStorages = useLoadingPersistStorages([
    usePlanetarySystemsStore,
    useLocationsStore,
    useLocationTypesStore,
    useMovingEntitiesStore,
    useMovingEntityClassesStore,
  ])
  const isLoading = isLoadingPersistStorages

  const {
    movingEntityUuid: selectedMovingEntityUuid,
    locationUuid: selectedLocationUuid,
    planetarySystemUuid: selectedPlanetarySystemUuid,
    mapMode: selectedMapMode,
  } = mapFilterValue || {}

  const searchResultTableColumns = useMemo(function searchResultTableColumnsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }
    return getSearchResultTableColumns()
  }, [isLoading])

  const handleSelectMapItem = useCallback(function handleSelectSearchResultItem(
    item: PlanetarySystem | Location | MovingEntity
  ) {
    if (isPlanetarySystem(item)) {
      setMapFilterValueToUrlSearchParams({
        planetarySystemUuid: item.uuid,
      })
    } else if (isLocation(item)) {
      setMapFilterValueToUrlSearchParams({
        locationUuid: item.uuid,
      })
    } else if (isMovingEntity(item)) {
      setMapFilterValueToUrlSearchParams({
        movingEntityUuid: item.uuid,
      })
    }
  }, [setMapFilterValueToUrlSearchParams])

  const mapMode = useMemo(function mapModeMemo() {
    if (selectedMovingEntityUuid || selectedLocationUuid) {
      return MAP_MODE_PLANETARY_SYSTEM
    }

    if (selectedPlanetarySystemUuid) {
      if (!selectedMapMode) {
        return MAP_MODE_PLANETARY_SYSTEM
      } else {
        return MAP_MODE_UNIVERSE
      }
    }

    return MAP_MODE_UNIVERSE
  }, [selectedMapMode, selectedMovingEntityUuid, selectedLocationUuid, selectedPlanetarySystemUuid])

  const searchResults = useGetMapSearchResults({
    searchFieldValue,
    selectedPlanetarySystemUuid,
    mapMode,
  })

  const mapItems = useGetMapItems(selectedPlanetarySystemUuid, mapMode)

  const selectedItemUuid = useMemo(function selectedItemUuidMemo() {
    return selectedMovingEntityUuid || selectedLocationUuid || selectedPlanetarySystemUuid
  }, [selectedPlanetarySystemUuid, selectedLocationUuid, selectedMovingEntityUuid])

  return (
    <>
      <title>{pageTitle}</title>

      <div className={styles.Container}>
        <div className={styles.SearchResults}>
          <SearchFormAndTableContainer>

            {SearchForm}

            <SearchResultsTable
              tableTitle="search results"
              items={searchResults}
              noItemsLabel="no results"
              isLoading={isLoading}

              searchFieldValue={searchFieldValue}
            >
              <SearchResultsTableBody
                items={searchResults}
                columns={searchResultTableColumns}
                onSelectItem={handleSelectMapItem}
                selectedItemUuid={selectedItemUuid}
              />
            </SearchResultsTable>
          </SearchFormAndTableContainer>
        </div>

        <div className={styles.MapContainer}>
          <Map
            isLoading={isLoading}
            items={mapItems}
            mapMode={mapMode}
            selectedPlanetarySystemUuid={selectedPlanetarySystemUuid}
            onSelectItem={handleSelectMapItem}
            selectedItemUuid={selectedItemUuid}
          />
        </div>

      </div>
    </>
  )
})
