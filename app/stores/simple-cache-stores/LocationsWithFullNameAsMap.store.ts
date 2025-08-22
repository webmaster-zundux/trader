import { type Location } from '~/models/entities/Location'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { Entity } from '~/models/Entity'
import { createNameFromParts, FULL_NAME_PART_SEPARATOR } from '~/models/utils/createNameFromParts'
import { getLocationsAsMapSelector, useLocationsStore } from '../entity-stores/Locations.store'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleMapCacheStore } from './createSimpleMapCacheStore'
import { getLocationNameAsLabel } from './LocationsAsSelectOptionArray.store'
import { getPlanetarySystemNameAsLabel } from './PlanetarySystemsAsSelectOptionArray.store'

export const useLocationsWithFullNameAsMapStore = createSimpleMapCacheStore<Entity['uuid'], string>()

function prepareDataLocationsWithFullNameAsMapStore() {
  const { isHydrating: isHydratingLocationsStore, isHydrated: isHydratedLocationsStore } = useLocationsStore.getState()
  const { isHydrating: isHydratingPlanetarySystemsStore, isHydrated: isHydratedPlanetarySystemsStore } = usePlanetarySystemsStore.getState()

  if (
    (isHydratingLocationsStore || !isHydratedLocationsStore)
    || (isHydratingPlanetarySystemsStore || !isHydratedPlanetarySystemsStore)
  ) {
    return
  }

  const locationsMap = getLocationsAsMapSelector()
  const planetarySystemsMap = getPlanetarySystemsAsMapSelector()

  replaceAllLocationsWithFullNameAsMapWithThrottle({ locationsMap, planetarySystemsMap })
}

useLocationsWithFullNameAsMapStore.setState({
  prepareData: prepareDataLocationsWithFullNameAsMapStore
})

useLocationsStore.subscribe(function onLocationsStoreStateChange() {
  prepareDataLocationsWithFullNameAsMapStore()
})

usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
  prepareDataLocationsWithFullNameAsMapStore()
})

export function getLocationsWithFullNamesSelector() {
  return useLocationsWithFullNameAsMapStore.getState()
}

export function getLocationsWithFullNamesAsMapSelector() {
  return getLocationsWithFullNamesSelector().itemsMap
}

export function getLocationsWithFullNamesAsArraySelector() {
  return getLocationsWithFullNamesSelector().items()
}

export function getLocationWithFullNameByUuidSelector(uuid: Entity['uuid']): string | undefined {
  return getLocationsWithFullNamesAsMapSelector().get(uuid)
}

export function getIsThereLocationWithTheSameLocationFullName(locationFullName: string): boolean {
  const items = getLocationsWithFullNamesAsArraySelector()

  const existingItemWithTheSameLocationFullName = items.find((item: string) => {
    return (item.localeCompare(locationFullName) === 0)
  })

  return !!existingItemWithTheSameLocationFullName
}

function replaceAllLocationsWithFullNameAsMapWithThrottle({
  locationsMap,
  planetarySystemsMap
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}) {
  const cacheStoreState = useLocationsWithFullNameAsMapStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const mapOfLocationsWithFullNames = createMapOfLocationsWithFullNames({ locationsMap, planetarySystemsMap })

    cacheStoreState.replaceAll(mapOfLocationsWithFullNames)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

function createMapOfLocationsWithFullNames({
  locationsMap,
  planetarySystemsMap
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}): Map<Entity['uuid'], string> {
  return createLocationWithFullNameMap({ locationsMap, planetarySystemsMap, shouldAddSuffixLabel: false })
};

export function createLocationFullNameFromParts({
  id,
  name,
  planetarySystemName,
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  id?: Location['id']
  name?: Location['name']
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
    planetarySystemName,
  ].filter(v => !!v)

  if (reverseOrder) {
    nameParts = nameParts.reverse()
  }

  return nameParts.join(namePartSeparator)
}

export function createLocationFullName({
  location,
  planetarySystemsMap,
  isUsingNoDataTextForEmptyParts = {},
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  location: Location
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  isUsingNoDataTextForEmptyParts?: { id?: boolean, planetarySystem?: boolean }
  reverseOrder?: boolean
  namePartSeparator?: string
}): string {
  const noIdData = isUsingNoDataTextForEmptyParts.id ? '(no-id)' : ''

  const planetarySystemUuid = location.planetarySystemUuid
  const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined
  const noPlanetarySystemData = isUsingNoDataTextForEmptyParts.planetarySystem ? '(no planetary system data)' : ''

  return createLocationFullNameFromParts({
    id: location.id ?? noIdData,
    name: location.name,
    planetarySystemName: planetarySystem?.name ?? noPlanetarySystemData,
    reverseOrder,
    namePartSeparator,
  })
}

function createLocationWithFullNameMap({
  locationsMap,
  planetarySystemsMap,
  shouldAddSuffixLabel = false
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  shouldAddSuffixLabel?: boolean
}): Map<Entity['uuid'], string> {
  const locationWithFullNameMap = new Map<Entity['uuid'], string>()

  const planetarySystems = getMapValuesAsArray(planetarySystemsMap)
  const locations = getMapValuesAsArray(locationsMap)

  planetarySystems.forEach(function forEach(planetarySystem) {
    const planetarySystemAsOptionUuid = planetarySystem.uuid
    const { planetarySystemName } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    locationWithFullNameMap.set(planetarySystemAsOptionUuid, planetarySystemName)
  })

  locations.forEach(function forEach(location) {
    const { planetarySystemUuid } = location
    const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined

    const planetarySystemAsOptionUuid = planetarySystem ? planetarySystem.uuid : undefined
    const { planetarySystemName } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    const locationAsOptionUuid = location.uuid
    const locationFullName = createLocationFullName({ location, planetarySystemsMap, isUsingNoDataTextForEmptyParts: { planetarySystem: true } })
    const { locationNameWithId } = getLocationNameAsLabel(location, shouldAddSuffixLabel, locationFullName)

    const existingPlanetarySystem = planetarySystemAsOptionUuid ? locationWithFullNameMap.get(planetarySystemAsOptionUuid) : undefined

    if (!existingPlanetarySystem && !!planetarySystemAsOptionUuid) {
      locationWithFullNameMap.set(planetarySystemAsOptionUuid, planetarySystemName)
    }

    locationWithFullNameMap.set(locationAsOptionUuid, locationNameWithId)
  })

  return locationWithFullNameMap
}
