import { useMemo } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getLocationsAsArraySelector, getLocationsByPlanetarySystemUuid, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getMovingEntitiesAsArraySelector, getMovingEntitiesByPlanetarySystemUuid, useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemsAsArraySelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { MAP_MODE_UNIVERSE, type MapMode } from '../Map.const'

function sortByName<T extends (PlanetarySystem | Location | MovingEntity) = (PlanetarySystem | Location | MovingEntity)>(a: T, b: T): number {
  return a.name.localeCompare(b.name)
}

function sortByIdOrAndName<T extends (Location | MovingEntity) = (Location | MovingEntity)>(a: T, b: T): number {
  if (a.id && b.id) {
    return a.id.localeCompare(b.id)
  }

  return a.name.localeCompare(b.name)
}

export function useGetMapSearchResults({
  searchFieldValue,
  selectedPlanetarySystemUuid,
  mapMode,
}: {
  searchFieldValue: string
  selectedPlanetarySystemUuid: PlanetarySystem['uuid'] | undefined
  mapMode: MapMode
}) {
  const isLoadingPersistStorages = useLoadingPersistStorages([
    usePlanetarySystemsStore,
    useLocationsStore,
    useMovingEntitiesStore,
  ])
  const isLoading = isLoadingPersistStorages

  const searchedPlanetarySystems = useMemo(function searchedPlanetarySystemsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (!searchFieldValue) {
      if (mapMode === MAP_MODE_UNIVERSE) {
        const planetarySystems = getPlanetarySystemsAsArraySelector()

        return planetarySystems
          .sort(sortByName)
      }

      return []
    }

    const planetarySystems = getPlanetarySystemsAsArraySelector()

    return planetarySystems
      .filter(planetarySystem => planetarySystem.name.includes(searchFieldValue))
      .sort(sortByName)
  }, [searchFieldValue, isLoading, mapMode])

  const searchedLocations = useMemo(function searchedLocationsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (!searchFieldValue) {
      if (mapMode === MAP_MODE_UNIVERSE) {
        return []
      }

      if (selectedPlanetarySystemUuid) {
        const locations = getLocationsByPlanetarySystemUuid(selectedPlanetarySystemUuid)

        return locations
          .sort(sortByIdOrAndName)
      }

      return []
    }

    const searchFieldValueAsId = searchFieldValue.toLocaleUpperCase()
    const locations = getLocationsAsArraySelector()

    return locations
      .filter((location) => {
        if (!!location.id && location.id.includes(searchFieldValueAsId)) {
          return true
        }

        return location.name.includes(searchFieldValue)
      })
      .sort(sortByIdOrAndName)
  }, [searchFieldValue, selectedPlanetarySystemUuid, isLoading, mapMode])

  const searchedMovingEntities = useMemo(function searchedMovingEntitiesMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (!searchFieldValue) {
      if (mapMode === MAP_MODE_UNIVERSE) {
        return []
      }

      if (selectedPlanetarySystemUuid) {
        const movingEntities = getMovingEntitiesByPlanetarySystemUuid(selectedPlanetarySystemUuid)

        return movingEntities
          .sort(sortByIdOrAndName)
      }

      return []
    }

    const searchFieldValueAsId = searchFieldValue.toLocaleUpperCase()
    const movingEntities = getMovingEntitiesAsArraySelector()

    return movingEntities
      .filter((movingEntity) => {
        if (!!movingEntity.id && movingEntity.id.includes(searchFieldValueAsId)) {
          return true
        }

        if (!!movingEntity.originalId && movingEntity.originalId.includes(searchFieldValueAsId)) {
          return true
        }

        return movingEntity.name.includes(searchFieldValue)
      })
      .sort(sortByIdOrAndName)
  }, [searchFieldValue, selectedPlanetarySystemUuid, isLoading, mapMode])

  const searchResults = useMemo(function searchResultsMemo() {
    return new Array<Location | PlanetarySystem | MovingEntity>().concat(
      searchedPlanetarySystems,
      searchedLocations,
      searchedMovingEntities
    )
  }, [searchedPlanetarySystems, searchedLocations, searchedMovingEntities])

  return searchResults
}
