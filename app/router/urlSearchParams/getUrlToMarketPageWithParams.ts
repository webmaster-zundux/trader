import type { Location } from '../../models/entities/Location'
import type { PlanetarySystem } from '../../models/entities/PlanetarySystem'
import type { Product } from '../../models/entities/Product'
import { PAGE_SLUG_MARKET } from "~/routes"
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, URL_SEARCH_PARAM_KEY_PRODUCT_NAME } from './UrlSearchParamsKeys.const'

export function getUrlToMarketPageWithParams({
  locationId,
  locationName,
  planetarySystemName,
  productName,
}: {
  locationId?: Location['id']
  locationName?: Location['name']
  planetarySystemName?: PlanetarySystem['name']
  productName?: Product['name']
}): string | undefined {
  const urlSearchParams = new URLSearchParams()

  if ((typeof locationId === 'string') && !!locationId) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_ID, locationId)
  }
  if ((typeof locationName === 'string') && !!locationName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_NAME, locationName)
  }

  if ((typeof planetarySystemName === 'string') && !!planetarySystemName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, planetarySystemName)
  }

  if ((typeof productName === 'string') && !!productName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PRODUCT_NAME, productName)
  }

  if (!urlSearchParams.size) {
    return undefined
  }

  return `${PAGE_SLUG_MARKET}?${urlSearchParams.toString()}`
}
