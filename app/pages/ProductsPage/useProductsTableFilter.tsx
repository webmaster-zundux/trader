import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { ProductFilter } from '~/models/entities-filters/ProductFilter'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME, URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getProductRarityByNameSelector, getProductRarityByUuidSelector, useProductRaritiesStore } from '~/stores/entity-stores/ProductRarities.store'
import { getProductTypeByNameSelector, getProductTypeByUuidSelector, useProductTypesStore } from '~/stores/entity-stores/ProductTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useProductRaritiesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductRaritiesAsSelectOptionArray.store'
import { useProductTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductTypesAsSelectOptionArray.store'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'

const PRODUCTS_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER = [
  URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME,
  URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME,
] as const

type ProductsTableUrlSearchParams = (Partial<Omit<ProductFilter, 'name'>> & {
  typeName?: string
  rarityName?: string
}) | undefined

function getProductsTableUrlSearchParams(urlSearchParams: URLSearchParams): ProductsTableUrlSearchParams {
  const filterValueWithAllAttributes = {
    typeName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME) || undefined,
    rarityName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME) || undefined,
  } satisfies ProductsTableUrlSearchParams

  return getFilterValueOnlyWithExistingAttributes(filterValueWithAllAttributes)
}

function prepareProductsTableFilterValue({
  filterValue,
}: {
  filterValue: ProductsTableUrlSearchParams
}): ProductFilter | undefined {
  if (!filterValue) {
    return undefined
  }

  const {
    typeName,
    rarityName,
    ...rest
  } = filterValue

  const productTypeUuid = typeName
    ? getProductTypeByNameSelector(typeName)?.uuid
    : undefined

  const productRarityUuid = rarityName
    ? getProductRarityByNameSelector(rarityName)?.uuid
    : undefined

  return {
    ...rest,
    productTypeUuid,
    productRarityUuid,
  } satisfies ProductFilter
}

export function useProductsTableFilter({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useProductTypesStore, useProductRaritiesStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useProductTypesAsSelectOptionArrayStore, useProductRaritiesAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const lastFilterValueRef = useRef<ProductFilter | undefined>(undefined)
  const filterValue = useMemo(function filterValueMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const searchingFilterValue = getProductsTableUrlSearchParams(urlSearchParams)
    const newFilterValue = prepareProductsTableFilterValue({
      filterValue: searchingFilterValue,
    })
    const prev = lastFilterValueRef.current
    const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (thereAreAnyChanges) {
      lastFilterValueRef.current = newFilterValue
      return newFilterValue
    }

    return prev
  }, [urlSearchParams, lastFilterValueRef, isLoading])

  const setFilterValueToUrlSearchParams: Dispatch<SetStateAction<ProductFilter | undefined>> = useCallback(function setFilterValueToUrlSearchParams(filterValue) {
    let newFilterValue: ProductFilter | undefined = undefined

    if (typeof filterValue === 'function') {
      throw new Error('ProductFilterValue as setState(prev=>newState) function not supported')
    } else {
      if (!!filterValue && Object.keys(filterValue).length > 0) {
        newFilterValue = filterValue
      }
    }

    setUrlSearchParams((prev) => {
      const prevFilterValue = getProductsTableUrlSearchParams(prev)
      const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newFilterValue)

      if (thereAreAnyChanges) {
        if (!newFilterValue) {
          PRODUCTS_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER.forEach((key) => {
            prev.delete(key)
          })

          return prev
        }

        const productTypeUuid = newFilterValue['productTypeUuid']
        const productTypeName = productTypeUuid ? getProductTypeByUuidSelector(productTypeUuid)?.name : undefined

        const productRarityUuid = newFilterValue['productRarityUuid']
        const productRarityName = productRarityUuid ? getProductRarityByUuidSelector(productRarityUuid)?.name : undefined

        if (productTypeName) {
          prev.set(URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME, productTypeName)
        } else {
          prev.delete(URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME)
        }

        if (productRarityName) {
          prev.set(URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME, productRarityName)
        } else {
          prev.delete(URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME)
        }
      }

      return prev
    })
  }, [setUrlSearchParams])

  return {
    filterValue,
    setFilterValueToUrlSearchParams,
  }
}
