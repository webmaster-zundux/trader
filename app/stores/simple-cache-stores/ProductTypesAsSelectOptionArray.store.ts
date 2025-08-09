import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { ProductType } from '~/models/entities/ProductType'
import type { TreeNode } from '~/models/forms/TreeNode'
import { getProductTypesAsMapSelector, useProductTypesStore } from '../entity-stores/ProductTypes.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { appendSuffixToLabel } from '../appendSuffixToLabel'

export type ProductTypeAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useProductTypesAsSelectOptionArrayStore = createSimpleArrayCacheStore<ProductTypeAsSelectOption>()

function prepareDataProductTypesAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingProductTypesStore, isHydrated: isHydratedProductTypesStore } = useProductTypesStore.getState()

  if (
    (isHydratingProductTypesStore || !isHydratedProductTypesStore)
  ) {
    return
  }

  const productTypesMap = getProductTypesAsMapSelector()

  replaceAllProductTypesAsSelectOptionArrayWithThrottle({ productTypesMap })
}

useProductTypesAsSelectOptionArrayStore.setState({
  prepareData: prepareDataProductTypesAsSelectOptionArrayStore
})

useProductTypesStore.subscribe(function onProductTypesStoreStateChange() {
  prepareDataProductTypesAsSelectOptionArrayStore()
})

function replaceAllProductTypesAsSelectOptionArrayWithThrottle({
  productTypesMap,
}: {
  productTypesMap: Map<ProductType['uuid'], ProductType>
}) {
  const cacheStoreState = useProductTypesAsSelectOptionArrayStore.getState()
  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getProductTypesWithUuidsAsSelectOptions({ productTypesMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getProductTypeNameAsLabel(productType: ProductType, shouldAddSuffixLabel = false) {
  const name = productType?.name ?? `(product type without name)`
  const nameAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(name, `product type`) : name

  return {
    name,
    nameAsLabel,
  }
}

function createProductTypeTree({
  productTypesMap,
  shouldAddSuffixLabel = false
}: {
  productTypesMap: Map<ProductType['uuid'], ProductType>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const tree: TreeNode[] = []

  const items = getMapValuesAsArray(productTypesMap) as ProductType[]

  items.forEach(function forEach(item) {
    const uuid = item.uuid
    const { name, nameAsLabel } = getProductTypeNameAsLabel(item, shouldAddSuffixLabel)

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

export function getProductTypesWithUuidsAsSelectOptions({
  productTypesMap,
  disableOptionsWithoutUuid,
}: {
  productTypesMap: Map<ProductType['uuid'], ProductType>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const tree = createProductTypeTree({ productTypesMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(tree)
  const selectOptions = generateSelectOptionList({ items: tree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
