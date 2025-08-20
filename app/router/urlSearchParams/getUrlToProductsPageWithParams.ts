import type { Product } from '../../models/entities/Product'
import type { ProductRarity } from '../../models/entities/ProductRarity'
import type { ProductType } from '../../models/entities/ProductType'
import { PAGE_SLUG_PRODUCTS } from "~/routes"
import { URL_SEARCH_PARAM_KEY_PRODUCT_NAME, URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME, URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME } from './UrlSearchParamsKeys.const'

export function getUrlToProductsPageWithParams({
  productName,
  productTypeName,
  productRarityName,
}: {
  productName?: Product['name']
  productTypeName?: ProductType['name']
  productRarityName?: ProductRarity['name']
}): string | undefined {
  const urlSearchParams = new URLSearchParams()

  if ((typeof productName === 'string') && !!productName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PRODUCT_NAME, productName)
  }

  if ((typeof productTypeName === 'string') && !!productTypeName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME, productTypeName)
  }

  if ((typeof productRarityName === 'string') && !!productRarityName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME, productRarityName)
  }

  if (!urlSearchParams.size) {
    return undefined
  }

  return `${PAGE_SLUG_PRODUCTS}?${urlSearchParams.toString()}`
}
