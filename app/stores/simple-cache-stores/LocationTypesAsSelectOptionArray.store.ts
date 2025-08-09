import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { LocationType } from '~/models/entities/LocationType'
import type { TreeNode } from '~/models/forms/TreeNode'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { getLocationTypesAsMapSelector, useLocationTypesStore } from '../entity-stores/LocationTypes.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { appendSuffixToLabel } from '../appendSuffixToLabel'

export type LocationTypeAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useLocationTypesAsSelectOptionArrayStore = createSimpleArrayCacheStore<LocationTypeAsSelectOption>()

function prepareDataLocationTypesAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingLocationTypesStore, isHydrated: isHydratedLocationTypesStore } = useLocationTypesStore.getState()

  if (
    (isHydratingLocationTypesStore || !isHydratedLocationTypesStore)
  ) {
    return
  }

  const locationTypesMap = getLocationTypesAsMapSelector()

  replaceAllLocationTypesAsSelectOptionArrayWithThrottle({ locationTypesMap })
}

useLocationTypesAsSelectOptionArrayStore.setState({
  prepareData: prepareDataLocationTypesAsSelectOptionArrayStore
})

useLocationTypesStore.subscribe(function onLocationTypesStoreStateChange() {
  prepareDataLocationTypesAsSelectOptionArrayStore()
})

function replaceAllLocationTypesAsSelectOptionArrayWithThrottle({
  locationTypesMap,
}: {
  locationTypesMap: Map<LocationType['uuid'], LocationType>
}) {
  const cacheStoreState = useLocationTypesAsSelectOptionArrayStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getLocationTypesWithUuidsAsSelectOptions({ locationTypesMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getLocationTypeNameAsLabel(locationType: LocationType, shouldAddSuffixLabel = false, fullLocationTypeName?: string) {
  const locationTypeName = locationType?.name ?? `(location type without name)`
  const locationTypeNameWithId = fullLocationTypeName ?? createNameFromParts([locationTypeName])
  const locationTypeNameWithIdAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(locationTypeName, `location type`) : locationTypeNameWithId

  return {
    locationTypeNameWithId,
    locationTypeNameWithIdAsLabel,
  }
}

function createLocationTypeTree({
  locationTypesMap,
  shouldAddSuffixLabel = false
}: {
  locationTypesMap: Map<LocationType['uuid'], LocationType>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const locationTypeTree: TreeNode[] = []

  const locationTypes = getMapValuesAsArray(locationTypesMap) as LocationType[]

  locationTypes.forEach(function forEach(locationType) {
    const locationTypeAsOptionUuid = locationType.uuid
    const { locationTypeNameWithId, locationTypeNameWithIdAsLabel } = getLocationTypeNameAsLabel(locationType, shouldAddSuffixLabel)

    locationTypeTree.push({
      uuid: locationTypeAsOptionUuid,
      name: locationTypeNameWithId,
      label: locationTypeNameWithIdAsLabel,
    })
  })

  return locationTypeTree
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

function getLocationTypesWithUuidsAsSelectOptions({
  locationTypesMap,
  disableOptionsWithoutUuid,
}: {
  locationTypesMap: Map<LocationType['uuid'], LocationType>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const locationTypeTree = createLocationTypeTree({ locationTypesMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(locationTypeTree)
  const selectOptions = generateSelectOptionList({ items: locationTypeTree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
