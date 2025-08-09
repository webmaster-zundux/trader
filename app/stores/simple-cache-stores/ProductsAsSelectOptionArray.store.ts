import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { Product } from '~/models/entities/Product'
import type { TreeNode } from '~/models/forms/TreeNode'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { getProductsAsMapSelector, useProductsStore } from '../entity-stores/Products.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleArrayCacheStore } from './createSimpleArrayCacheStore'
import { appendSuffixToLabel } from '../appendSuffixToLabel'

export type ProductAsSelectOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

export const useProductsAsSelectOptionArrayStore = createSimpleArrayCacheStore<ProductAsSelectOption>()

function prepareDataProductsAsSelectOptionArrayStore() {
  const { isHydrating: isHydratingProductsStore, isHydrated: isHydratedProductsStore } = useProductsStore.getState()

  if (
    (isHydratingProductsStore || !isHydratedProductsStore)
  ) {
    return
  }

  const productsMap = getProductsAsMapSelector()

  replaceAllProductsAsSelectOptionArrayWithThrottle({ productsMap })
}

useProductsAsSelectOptionArrayStore.setState({
  prepareData: prepareDataProductsAsSelectOptionArrayStore
})

useProductsStore.subscribe(function onProductsStoreStateChange() {
  prepareDataProductsAsSelectOptionArrayStore()
})

function replaceAllProductsAsSelectOptionArrayWithThrottle({
  productsMap,
}: {
  productsMap: Map<Product['uuid'], Product>
}) {
  const cacheStoreState = useProductsAsSelectOptionArrayStore.getState()
  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const selectOptions = getProductsWithUuidsAsSelectOptions({ productsMap })

    cacheStoreState.replaceAll(selectOptions)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function getProductNameAsLabel(product: Product, shouldAddSuffixLabel = false, fullProductName?: string) {
  const productName = product?.name ?? `(product without name)`
  const productNameWithId = fullProductName ?? createNameFromParts([productName])
  const productNameWithIdAsLabel = shouldAddSuffixLabel ? appendSuffixToLabel(productName, `product`) : productNameWithId

  return {
    productNameWithId,
    productNameWithIdAsLabel,
  }
}

function createProductTree({
  productsMap,
  shouldAddSuffixLabel = false
}: {
  productsMap: Map<Product['uuid'], Product>
  shouldAddSuffixLabel?: boolean
}): TreeNode[] {
  const productTree: TreeNode[] = []

  const products = getMapValuesAsArray(productsMap) as Product[]

  products.forEach(function forEach(product) {
    const productAsOptionUuid = product.uuid
    const { productNameWithId, productNameWithIdAsLabel } = getProductNameAsLabel(product, shouldAddSuffixLabel)

    productTree.push({
      uuid: productAsOptionUuid,
      name: productNameWithId,
      label: productNameWithIdAsLabel,
    })
  })

  return productTree
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

function getProductsWithUuidsAsSelectOptions({
  productsMap,
  disableOptionsWithoutUuid,
}: {
  productsMap: Map<Product['uuid'], Product>
  disableOptionsWithoutUuid?: boolean
}): SelectFieldOption[] {
  const productTree = createProductTree({ productsMap, shouldAddSuffixLabel: false })

  sortInPlaceTreeByNamesAlphabetically(productTree)
  const selectOptions = generateSelectOptionList({ items: productTree, disableOptionsWithoutUuid })

  return selectOptions ?? []
}
