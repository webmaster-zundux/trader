import { type Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { Entity } from '~/models/Entity'
import { createNameFromParts, FULL_NAME_PART_SEPARATOR } from '~/models/utils/createNameFromParts'
import { getLocationsAsMapSelector } from '../entity-stores/Locations.store'
import { getMovingEntitiesAsMapSelector, useMovingEntitiesStore } from '../entity-stores/MovingEntities.store'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleMapCacheStore } from './createSimpleMapCacheStore'
import { getMovingEntityNameAsLabel } from './MovingEntitiesAsSelectOptionArray.store'
import { getPlanetarySystemNameAsLabel } from './PlanetarySystemsAsSelectOptionArray.store'

export const useMovingEntitiesWithFullNameAsMapStore = createSimpleMapCacheStore<Entity['uuid'], string>()

function prepareDataMovingEntitiesWithFullNameAsMapStore() {
  const { isHydrating: isHydratingMovingEntitiesStore, isHydrated: isHydratedMovingEntitiesStore } = useMovingEntitiesStore.getState()
  const { isHydrating: isHydratingPlanetarySystemsStore, isHydrated: isHydratedPlanetarySystemsStore } = usePlanetarySystemsStore.getState()

  if (
    (isHydratingMovingEntitiesStore || !isHydratedMovingEntitiesStore)
    || (isHydratingPlanetarySystemsStore || !isHydratedPlanetarySystemsStore)
  ) {
    return
  }

  const movingEntitiesMap = getMovingEntitiesAsMapSelector()
  const locationsMap = getLocationsAsMapSelector()
  const planetarySystemsMap = getPlanetarySystemsAsMapSelector()

  replaceAllMovingEntitiesWithFullNameAsMapWithThrottle({ movingEntitiesMap, locationsMap, planetarySystemsMap })
}

useMovingEntitiesWithFullNameAsMapStore.setState({
  prepareData: prepareDataMovingEntitiesWithFullNameAsMapStore
})

useMovingEntitiesStore.subscribe(function onMovingEntitiesStoreStateChange() {
  prepareDataMovingEntitiesWithFullNameAsMapStore()
})

usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
  prepareDataMovingEntitiesWithFullNameAsMapStore()
})

export function getMovingEntitiesWithFullNamesSelector() {
  return useMovingEntitiesWithFullNameAsMapStore.getState()
}

export function getMovingEntitiesWithFullNamesAsMapSelector() {
  return getMovingEntitiesWithFullNamesSelector().itemsMap
}

export function getMovingEntitiesWithFullNamesAsArraySelector() {
  return getMovingEntitiesWithFullNamesSelector().items()
}

export function getLocationWithFullNameByUuidSelector(uuid: Entity['uuid']): string | undefined {
  return getMovingEntitiesWithFullNamesAsMapSelector().get(uuid)
}

export function getIsThereLocationWithTheSameLocationFullName(movingEntityFullName: string): boolean {
  const items = getMovingEntitiesWithFullNamesAsArraySelector()

  const existingItemWithTheSameFullName = items.find((item: string) => {
    return (item.localeCompare(movingEntityFullName) === 0)
  })

  return !!existingItemWithTheSameFullName
}

function replaceAllMovingEntitiesWithFullNameAsMapWithThrottle({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}) {
  const cacheStoreState = useMovingEntitiesWithFullNameAsMapStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const mapOfMovingEntitiesWithFullNames = createMapOfMovingEntitiesWithFullNames({ movingEntitiesMap, locationsMap, planetarySystemsMap })

    cacheStoreState.replaceAll(mapOfMovingEntitiesWithFullNames)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

function createMapOfMovingEntitiesWithFullNames({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}): Map<Entity['uuid'], string> {
  return createMovingEntityWithFullNameMap({ movingEntitiesMap, locationsMap, planetarySystemsMap, shouldAddSuffixLabel: false })
};

export function createMovingEntityFullNameFromParts({
  id,
  name,
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  id?: MovingEntity['id']
  name?: MovingEntity['name']
  planetarySystemName?: PlanetarySystem['name']
  reverseOrder?: boolean
  namePartSeparator?: string
}): string {
  const fullName = createNameFromParts([
    id,
    name,
  ], false, ' ')

  let nameParts = [
    fullName,
  ].filter(v => !!v)

  if (reverseOrder) {
    nameParts = nameParts.reverse()
  }

  return nameParts.join(namePartSeparator)
}

export function createMovingEntityFullName({
  movingEntity,
  locationsMap,
  planetarySystemsMap,
  isUsingNoDataTextForEmptyParts = {},
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  movingEntity: MovingEntity
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  isUsingNoDataTextForEmptyParts?: { id?: boolean, planetarySystem?: boolean }
  reverseOrder?: boolean
  namePartSeparator?: string
}): string {
  const noIdData = isUsingNoDataTextForEmptyParts.id ? '(no-id)' : ''

  const locationUuid = movingEntity.locationUuid
  const location = locationUuid ? locationsMap.get(locationUuid) : undefined
  const planetarySystemUuid = location?.planetarySystemUuid
  const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined
  const noPlanetarySystemData = isUsingNoDataTextForEmptyParts.planetarySystem ? '(no planetary system data)' : ''

  return createMovingEntityFullNameFromParts({
    id: movingEntity.id ?? noIdData,
    name: movingEntity.name,
    planetarySystemName: planetarySystem?.name ?? noPlanetarySystemData,
    reverseOrder,
    namePartSeparator,
  })
}

function createMovingEntityWithFullNameMap({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap,
  shouldAddSuffixLabel = false
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  shouldAddSuffixLabel?: boolean
}): Map<Entity['uuid'], string> {
  const movingEntityWithFullNameMap = new Map<Entity['uuid'], string>()

  const planetarySystems = getMapValuesAsArray(planetarySystemsMap) as PlanetarySystem[]
  const movingEntities = getMapValuesAsArray(movingEntitiesMap) as MovingEntity[]

  planetarySystems.forEach(function forEach(planetarySystem) {
    const planetarySystemAsOptionUuid = planetarySystem.uuid
    const { planetarySystemName } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    movingEntityWithFullNameMap.set(planetarySystemAsOptionUuid, planetarySystemName)
  })

  movingEntities.forEach(function forEach(movingEntity) {
    const locationUuid = movingEntity?.locationUuid
    const location = locationsMap.get(locationUuid)
    const planetarySystemUuid = location?.planetarySystemUuid
    const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined

    const planetarySystemAsOptionUuid = planetarySystem ? planetarySystem.uuid : undefined
    const { planetarySystemName } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    const movingEntityAsOptionUuid = movingEntity.uuid
    const movingEntityFullName = location ? createMovingEntityFullName({ movingEntity, locationsMap, planetarySystemsMap, isUsingNoDataTextForEmptyParts: { planetarySystem: true } }) : undefined
    const { movingEntityNameWithId } = getMovingEntityNameAsLabel(movingEntity, shouldAddSuffixLabel, movingEntityFullName)

    const existingPlanetarySystem = planetarySystemAsOptionUuid ? movingEntityWithFullNameMap.get(planetarySystemAsOptionUuid) : undefined

    if (!existingPlanetarySystem && !!planetarySystemAsOptionUuid) {
      movingEntityWithFullNameMap.set(planetarySystemAsOptionUuid, planetarySystemName)
    }

    movingEntityWithFullNameMap.set(movingEntityAsOptionUuid, movingEntityNameWithId)
  })

  return movingEntityWithFullNameMap
}
