import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { TreeNode } from '~/models/forms/TreeNode'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { appendSuffixToLabel } from '../appendSuffixToLabel'

export type PlanetarySystemAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const usePlanetarySystemsAsSelectOptionArrayStore = createSimpleArrayCacheStore<PlanetarySystemAsSelectOption>()

function prepareDataPlanetarySystemsAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingPlanetarySystemsStore, isHydrated: isHydratedPlanetarySystemsStore } = usePlanetarySystemsStore.getState()

  if (
    (isHydratingPlanetarySystemsStore || !isHydratedPlanetarySystemsStore)
  ) {
    return
  }

  const planetarySystemsMap = getPlanetarySystemsAsMapSelector()

  replaceAllPlanetarySystemsAsSelectOptionArrayWithThrottle({ planetarySystemsMap })
}

usePlanetarySystemsAsSelectOptionArrayStore.setState({
  prepareData: prepareDataPlanetarySystemsAsSelectOptionArrayStore
})

usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
  prepareDataPlanetarySystemsAsSelectOptionArrayStore()
})

function replaceAllPlanetarySystemsAsSelectOptionArrayWithThrottle({
  planetarySystemsMap,
}: {
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
}) {
  const cacheStoreState = usePlanetarySystemsAsSelectOptionArrayStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getPlanetarySystemsWithUuidsAsSelectOptions({ planetarySystemsMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getPlanetarySystemNameAsLabel(planetarySystem?: PlanetarySystem, shouldAddSuffixLabel = false, fullPlanetarySystemName?: string) {
  const planetarySystemName = planetarySystem?.name ?? `(planetary system without name)`
  const planetarySystemNameWithId = fullPlanetarySystemName ?? createNameFromParts([planetarySystemName])
  const planetarySystemNameWithIdAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(planetarySystemName, `planetary system`) : planetarySystemNameWithId

  return {
    planetarySystemName: planetarySystemNameWithId,
    planetarySystemNameAsLabel: planetarySystemNameWithIdAsLabel,
  }
}

function createPlanetarySystemTree({
  planetarySystemsMap,
  shouldAddSuffixLabel = false
}: {
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const planetarySystemTree: TreeNode[] = []

  const planetarySystems = getMapValuesAsArray(planetarySystemsMap)

  planetarySystems.forEach(function forEach(planetarySystem) {
    const planetarySystemAsOptionUuid = planetarySystem.uuid
    const { planetarySystemName: planetarySystemNameWithId, planetarySystemNameAsLabel: planetarySystemNameWithIdAsLabel } = getPlanetarySystemNameAsLabel(planetarySystem, shouldAddSuffixLabel)

    planetarySystemTree.push({
      uuid: planetarySystemAsOptionUuid,
      name: planetarySystemNameWithId,
      label: planetarySystemNameWithIdAsLabel,
    })
  })

  return planetarySystemTree
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

function getPlanetarySystemsWithUuidsAsSelectOptions({
  planetarySystemsMap,
  disableOptionsWithoutUuid,
}: {
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const planetarySystemTree = createPlanetarySystemTree({ planetarySystemsMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(planetarySystemTree)
  const selectOptions = generateSelectOptionList({ items: planetarySystemTree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
