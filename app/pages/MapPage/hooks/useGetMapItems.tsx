import { useMemo } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getLocationsByPlanetarySystemUuid, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getMovingEntitiesByPlanetarySystemUuid, useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemsAsArraySelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { MAP_MODE_UNIVERSE, type MapMode } from '../Map.const'

export function useGetMapItems(
  selectedPlanetarySystemUuid: PlanetarySystem['uuid'] | undefined,
  mapMode: MapMode
) {
  const isLoadingPersistStorages = useLoadingPersistStorages([
    usePlanetarySystemsStore,
    useLocationsStore,
    useMovingEntitiesStore,
  ])
  const isLoading = isLoadingPersistStorages

  const locationsInPlanetarySystem = useMemo(function locationsInPlanetarySystemMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (mapMode === MAP_MODE_UNIVERSE) {
      return []
    }

    if (!selectedPlanetarySystemUuid) {
      return []
    }

    return getLocationsByPlanetarySystemUuid(selectedPlanetarySystemUuid)
  }, [selectedPlanetarySystemUuid, isLoading, mapMode])

  const movignEntitiesInPlanetarySystem = useMemo(function movignEntitiesInPlanetarySystemMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (mapMode === MAP_MODE_UNIVERSE) {
      return []
    }

    if (!selectedPlanetarySystemUuid) {
      return []
    }

    return getMovingEntitiesByPlanetarySystemUuid(selectedPlanetarySystemUuid)
  }, [selectedPlanetarySystemUuid, isLoading, mapMode])

  const planetarySystems = useMemo(function planetarySystemsMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (mapMode === MAP_MODE_UNIVERSE) {
      return getPlanetarySystemsAsArraySelector()
    }

    return []
  }, [isLoading, mapMode])

  const mapItems = useMemo(function mapItemsMemo(): (PlanetarySystem | Location | MovingEntity)[] {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    if (mapMode === MAP_MODE_UNIVERSE) {
      return planetarySystems
    }

    return new Array<PlanetarySystem | Location | MovingEntity>().concat(
      locationsInPlanetarySystem,
      movignEntitiesInPlanetarySystem
    )
  }, [planetarySystems, locationsInPlanetarySystem, movignEntitiesInPlanetarySystem, isLoading, mapMode])

  return mapItems
}
