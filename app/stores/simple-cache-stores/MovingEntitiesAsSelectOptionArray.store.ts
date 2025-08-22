import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { Location } from '~/models/entities/Location'
import { type MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { TreeNode } from '~/models/forms/TreeNode'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { appendSuffixToLabel } from '../appendSuffixToLabel'
import { getLocationsAsMapSelector } from '../entity-stores/Locations.store'
import { getMovingEntitiesAsMapSelector, useMovingEntitiesStore } from '../entity-stores/MovingEntities.store'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { getPlanetarySystemNameAsLabel } from './PlanetarySystemsAsSelectOptionArray.store'

export type MovingEntityAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useMovingEntitiesAsSelectOptionArrayStore = createSimpleArrayCacheStore<MovingEntityAsSelectOption>()

function prepareDataForMovingEntitiesAsSelectOptionArrayStore() {
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

  replaceAllMovingEntitiesAsSelectOptionArrayWithThrottle({ movingEntitiesMap, locationsMap, planetarySystemsMap })
}

useMovingEntitiesAsSelectOptionArrayStore.setState({
  prepareData: prepareDataForMovingEntitiesAsSelectOptionArrayStore
})

useMovingEntitiesStore.subscribe(function onMovingEntitiesStoreStateChange() {
  prepareDataForMovingEntitiesAsSelectOptionArrayStore()
})

usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
  prepareDataForMovingEntitiesAsSelectOptionArrayStore()
})

function replaceAllMovingEntitiesAsSelectOptionArrayWithThrottle({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}) {
  const cacheStoreState = useMovingEntitiesAsSelectOptionArrayStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getMovingEntitiesWithUuidsAsSelectOptions({ movingEntitiesMap, locationsMap, planetarySystemsMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getMovingEntityNameAsLabel(movingEntity: MovingEntity, shouldAddSuffixLabel = false, fullMovingEntityName?: string) {
  const idString = (movingEntity?.id ?? '')
  const movingEntityName = movingEntity?.name ?? `(movingEntity without name)`
  const movingEntityNameWithId = fullMovingEntityName ?? createNameFromParts([idString, movingEntityName])
  const movingEntityNameWithIdAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(movingEntityName, `name`) : movingEntityNameWithId

  return {
    movingEntityNameWithId,
    movingEntityNameWithIdAsLabel,
  }
}

function createMovingEntityTree({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap,
  shouldAddSuffixLabel = false
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const movingEntityTree: TreeNode[] = []

  const planetarySystems = getMapValuesAsArray(planetarySystemsMap)
  const movingEntities = getMapValuesAsArray(movingEntitiesMap)

  planetarySystems.forEach(function forEach(planetarySystem) {
    const planetarySystemAsOptionUuid = planetarySystem ? planetarySystem.uuid : undefined
    const { planetarySystemName, planetarySystemNameAsLabel } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    movingEntityTree.push({
      uuid: planetarySystemAsOptionUuid,
      name: planetarySystemName,
      label: planetarySystemNameAsLabel,
      items: [],
    })
  })

  movingEntities.forEach(function forEach(movingEntity) {
    const location = locationsMap.get(movingEntity.locationUuid)
    const planetarySystemUuid = location?.planetarySystemUuid

    const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined
    const planetarySystemAsOptionUuid = planetarySystem?.uuid
    const { planetarySystemName, planetarySystemNameAsLabel } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    const movingEntityAsOptionUuid = movingEntity.uuid
    const { movingEntityNameWithId, movingEntityNameWithIdAsLabel } = getMovingEntityNameAsLabel(movingEntity, shouldAddSuffixLabel)

    const existingPlanetarySystem = movingEntityTree.find(item => item.uuid === planetarySystemAsOptionUuid) // todo - redo by using Map

    if (!existingPlanetarySystem) {
      movingEntityTree.push({
        uuid: planetarySystemAsOptionUuid,
        name: planetarySystemName,
        label: planetarySystemNameAsLabel,
        items: [{
          uuid: movingEntityAsOptionUuid,
          name: movingEntityNameWithId,
          label: movingEntityNameWithIdAsLabel,
        }],
      })
    } else {
      if (!existingPlanetarySystem.items) {
        existingPlanetarySystem.items = []
      }

      const existingMovingEntity = existingPlanetarySystem.items.find(item => item.uuid === movingEntityAsOptionUuid) // todo - redo by using Map

      if (!existingMovingEntity) {
        existingPlanetarySystem.items.push({
          uuid: movingEntityAsOptionUuid,
          name: movingEntityNameWithId,
          label: movingEntityNameWithIdAsLabel,
        })
      }
    }
  })

  return movingEntityTree
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

function getMovingEntitiesWithUuidsAsSelectOptions({
  movingEntitiesMap,
  locationsMap,
  planetarySystemsMap,
  disableOptionsWithoutUuid,
}: {
  movingEntitiesMap: Map<MovingEntity['uuid'], MovingEntity>
  locationsMap: Map<Location['uuid'], Location>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const movingEntityTree = createMovingEntityTree({ movingEntitiesMap, locationsMap, planetarySystemsMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(movingEntityTree)
  const selectOptions = generateSelectOptionList({ items: movingEntityTree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
