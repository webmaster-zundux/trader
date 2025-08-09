import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import { type Location } from '~/models/entities/Location'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { TreeNode } from '~/models/forms/TreeNode'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { appendSuffixToLabel } from '../appendSuffixToLabel'
import { getLocationsAsMapSelector, useLocationsStore } from '../entity-stores/Locations.store'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { getPlanetarySystemNameAsLabel } from './PlanetarySystemsAsSelectOptionArray.store'

export type LocationAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useLocationsAsSelectOptionArrayStore = createSimpleArrayCacheStore<LocationAsSelectOption>()

function prepareDataForLocationsAsSelectOptionArrayStore() {
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

  replaceAllLocationsAsSelectOptionArrayWithThrottle({ locationsMap, planetarySystemsMap })
}

useLocationsAsSelectOptionArrayStore.setState({
  prepareData: prepareDataForLocationsAsSelectOptionArrayStore
})

useLocationsStore.subscribe(function onLocationsStoreStateChange() {
  prepareDataForLocationsAsSelectOptionArrayStore()
})

usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
  prepareDataForLocationsAsSelectOptionArrayStore()
})

function replaceAllLocationsAsSelectOptionArrayWithThrottle({
  locationsMap,
  planetarySystemsMap
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}) {
  const cacheStoreState = useLocationsAsSelectOptionArrayStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getLocationsWithUuidsAsSelectOptions({ locationsMap, planetarySystemsMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getLocationNameAsLabel(location: Location, shouldAddSuffixLabel = false, fullLocationName?: string) {
  const idString = (location?.id ?? '')
  const locationName = location?.name ?? `(location without name)`
  const locationNameWithId = fullLocationName ?? createNameFromParts([idString, locationName])
  const locationNameWithIdAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(locationName, `name`) : locationNameWithId

  return {
    locationNameWithId,
    locationNameWithIdAsLabel,
  }
}

function createLocationTree({
  locationsMap,
  planetarySystemsMap,
  shouldAddSuffixLabel = false
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const locationTree: TreeNode[] = []

  const planetarySystems = getMapValuesAsArray(planetarySystemsMap) as PlanetarySystem[]
  const locations = getMapValuesAsArray(locationsMap) as Location[]

  planetarySystems.forEach(function forEach(planetarySystem) {
    const planetarySystemAsOptionUuid = planetarySystem ? planetarySystem.uuid : undefined
    const { planetarySystemName, planetarySystemNameAsLabel } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    locationTree.push({
      uuid: planetarySystemAsOptionUuid,
      name: planetarySystemName,
      label: planetarySystemNameAsLabel,
      items: [],
    })
  })

  locations.forEach(function forEach(location) {
    const { planetarySystemUuid } = location
    const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined

    const planetarySystemAsOptionUuid = planetarySystem ? planetarySystem.uuid : undefined
    const { planetarySystemName, planetarySystemNameAsLabel } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    const locationAsOptionUuid = location.uuid
    const { locationNameWithId, locationNameWithIdAsLabel } = getLocationNameAsLabel(location, shouldAddSuffixLabel)

    const existingPlanetarySystem = locationTree.find(item => item.uuid === planetarySystemAsOptionUuid) // todo - redo by using Map

    if (!existingPlanetarySystem) {
      locationTree.push({
        uuid: planetarySystemAsOptionUuid,
        name: planetarySystemName,
        label: planetarySystemNameAsLabel,
        items: [{
          uuid: locationAsOptionUuid,
          name: locationNameWithId,
          label: locationNameWithIdAsLabel,
        }],
      })
    } else {
      if (!existingPlanetarySystem.items) {
        existingPlanetarySystem.items = []
      }

      const existingLocation = existingPlanetarySystem.items.find(item => item.uuid === locationAsOptionUuid) // todo - redo by using Map

      if (!existingLocation) {
        existingPlanetarySystem.items.push({
          uuid: locationAsOptionUuid,
          name: locationNameWithId,
          label: locationNameWithIdAsLabel,
        })
      }
    }
  })

  return locationTree
}

function sortInPlaceTreeByNamesAlphabetically(items: TreeNode[]) {
  items.sort((a, b) => a.name.localeCompare(b.name))
  items.forEach(({ items }) => sortInPlaceTreeByNamesAlphabetically(items ?? []))
}

function generateSelectOptionList({
  items = [],
  level = 0,
  disableOptionsWithoutUuid = true,
  selectOptions = new Array<SelectFieldOption>(),
}: {
  items: TreeNode[]
  level?: number
  disableOptionsWithoutUuid?: boolean
  selectOptions?: SelectFieldOption[]
}): SelectFieldOption[] | undefined {
  items.forEach((item) => {
    const { label, items: subItems } = item

    const rawValue = item['uuid']
    const value = rawValue ?? ''

    selectOptions.push({
      value: value,
      label: label,
      level: level,
      disabled: disableOptionsWithoutUuid ? !rawValue : false,
    })

    if (!subItems?.length) {
      return
    }

    generateSelectOptionList({
      items: subItems,
      level: level + 1,
      disableOptionsWithoutUuid,
      selectOptions,
    })
  })

  return selectOptions
}

function getLocationsWithUuidsAsSelectOptions({
  locationsMap,
  planetarySystemsMap,
  disableOptionsWithoutUuid,
}: {
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const locationTree = createLocationTree({ planetarySystemsMap, locationsMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(locationTree)
  const selectOptions = generateSelectOptionList({ items: locationTree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
