import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { ProductRarity } from '~/models/entities/ProductRarity'
import type { TreeNode } from '~/models/forms/TreeNode'
import { getProductRaritiesAsMapSelector, useProductRaritiesStore } from '../entity-stores/ProductRarities.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { appendSuffixToLabel } from '../appendSuffixToLabel'

export type ProductRarityAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useProductRaritiesAsSelectOptionArrayStore = createSimpleArrayCacheStore<ProductRarityAsSelectOption>()

function prepareDataProductRaritiesAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingProductRaritiesStore, isHydrated: isHydratedProductRaritiesStore } = useProductRaritiesStore.getState()

  if (
    (isHydratingProductRaritiesStore || !isHydratedProductRaritiesStore)
  ) {
    return
  }

  const productRaritiesMap = getProductRaritiesAsMapSelector()

  replaceAllProductRaritiesAsSelectOptionArrayWithThrottle({ productRaritiesMap })
}

useProductRaritiesAsSelectOptionArrayStore.setState({
  prepareData: prepareDataProductRaritiesAsSelectOptionArrayStore
})

useProductRaritiesStore.subscribe(function onProductRaritiesStoreStateChange() {
  prepareDataProductRaritiesAsSelectOptionArrayStore()
})

function replaceAllProductRaritiesAsSelectOptionArrayWithThrottle({
  productRaritiesMap,
}: {
  productRaritiesMap: Map<ProductRarity['uuid'], ProductRarity>
}) {
  const cacheStoreState = useProductRaritiesAsSelectOptionArrayStore.getState()
  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getProductRaritiesWithUuidsAsSelectOptions({ productRaritiesMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getProductRarityNameAsLabel(productRarity: ProductRarity, shouldAddSuffixLabel = false) {
  const name = productRarity?.name ?? `(product rarity without name)`
  const nameAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(name, `product rarity`) : name

  return {
    name,
    nameAsLabel,
  }
}

function createProductRarityTree({
  productRaritiesMap,
  shouldAddSuffixLabel = false
}: {
  productRaritiesMap: Map<ProductRarity['uuid'], ProductRarity>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const tree: TreeNode[] = []

  const items = getMapValuesAsArray(productRaritiesMap)

  items.forEach(function forEach(item) {
    const uuid = item.uuid
    const { name, nameAsLabel } = getProductRarityNameAsLabel(item, shouldAddSuffixLabel)

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

export function getProductRaritiesWithUuidsAsSelectOptions({
  productRaritiesMap,
  disableOptionsWithoutUuid,
}: {
  productRaritiesMap: Map<ProductRarity['uuid'], ProductRarity>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const tree = createProductRarityTree({ productRaritiesMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(tree)
  const selectOptions = generateSelectOptionList({ items: tree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
