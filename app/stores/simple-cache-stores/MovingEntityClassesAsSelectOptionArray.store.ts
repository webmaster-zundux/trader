import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import type { TreeNode } from '~/models/forms/TreeNode'
import { appendSuffixToLabel } from '../appendSuffixToLabel'
import { getMovingEntityClassesAsMapSelector, useMovingEntityClassesStore } from '../entity-stores/MovingEntityClasses.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'

export type MovingEntityClassAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useMovingEntityClassesAsSelectOptionArrayStore = createSimpleArrayCacheStore<MovingEntityClassAsSelectOption>()

function prepareDataMovingEntityClassesAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingMovingEntityClassesStore, isHydrated: isHydratedMovingEntityClassesStore } = useMovingEntityClassesStore.getState()

  if (
    (isHydratingMovingEntityClassesStore || !isHydratedMovingEntityClassesStore)
  ) {
    return
  }

  const movingEntitiesMap = getMovingEntityClassesAsMapSelector()

  replaceAllMovingEntityClassesAsSelectOptionArrayWithThrottle({ movingEntitiesMap })
}

useMovingEntityClassesAsSelectOptionArrayStore.setState({
  prepareData: prepareDataMovingEntityClassesAsSelectOptionArrayStore
})

useMovingEntityClassesStore.subscribe(function onMovingEntityClassesStoreStateChange() {
  prepareDataMovingEntityClassesAsSelectOptionArrayStore()
})

function replaceAllMovingEntityClassesAsSelectOptionArrayWithThrottle({
  movingEntitiesMap,
}: {
  movingEntitiesMap: Map<MovingEntityClass['uuid'], MovingEntityClass>
}) {
  const cacheStoreState = useMovingEntityClassesAsSelectOptionArrayStore.getState()
  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getMovingEntityClassesWithUuidsAsSelectOptions({ movingEntitiesMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getMovingEntityClassNameAsLabel(movingEntityClass: MovingEntityClass, shouldAddSuffixLabel = false) {
  const name = movingEntityClass?.name ?? `(moving object class without name)`
  const nameAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(name, `entity class`) : name

  return {
    name,
    nameAsLabel,
  }
}

function createMovingEntityClassTree({
  movingEntitiesMap,
  shouldAddSuffixLabel = false
}: {
  movingEntitiesMap: Map<MovingEntityClass['uuid'], MovingEntityClass>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const tree: TreeNode[] = []

  const items = getMapValuesAsArray(movingEntitiesMap) as MovingEntityClass[]

  items.forEach(function forEach(item) {
    const uuid = item.uuid
    const { name, nameAsLabel } = getMovingEntityClassNameAsLabel(item, shouldAddSuffixLabel)

    tree.push({
      uuid: uuid,
      name: name,
      label: nameAsLabel,
    })
  })

  return tree
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
      value,
      label,
      level,
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

export function getMovingEntityClassesWithUuidsAsSelectOptions({
  movingEntitiesMap,
  disableOptionsWithoutUuid,
}: {
  movingEntitiesMap: Map<MovingEntityClass['uuid'], MovingEntityClass>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const tree = createMovingEntityClassTree({ movingEntitiesMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(tree)
  const selectOptions = generateSelectOptionList({ items: tree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
