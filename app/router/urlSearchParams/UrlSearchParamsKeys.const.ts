export const URL_SEARCH_PARAM_KEY_LOCATION_ID = 'locationId' as const
export const URL_SEARCH_PARAM_KEY_LOCATION_NAME = 'locationName' as const
export const URL_SEARCH_PARAM_KEY_LOCATION_POSITION = 'locationPosition' as const
export const URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME = 'locationTypeName' as const
export function getLocationIdFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_ID) || ''
}
export function getLocationNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_NAME) || ''
}
export function getLocationPositionFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_POSITION) || ''
}
export function getLocationTypeNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME) || ''
}
export const URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME = 'planetarySystemName' as const
export function getPlanetarySystemNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || ''
}
export const URL_SEARCH_PARAM_KEY_MAP_MODE = 'mapMode' as const
export function getMapModeFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAP_MODE) || ''
}
export const URL_SEARCH_PARAM_KEY_SEARCH_VALUE = 'search'
export function getMapSearchValueFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_SEARCH_VALUE) || ''
}

export const URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID = 'destinationLocationId' as const
export const URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME = 'destinationLocationName' as const
export const URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_POSITION = 'destinationLocationPosition' as const
export function getDestinationLocationIdFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID) || ''
}
export function getDestinationLocationNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME) || ''
}
export function getDestinationLocationPositionFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_POSITION) || ''
}
export const URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME = 'destinationPlanetarySystemName' as const
export function getDestinationPlanetarySystemNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME) || ''
}

export const URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID = 'homeLocationId' as const
export const URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME = 'homeLocationName' as const
export const URL_SEARCH_PARAM_KEY_HOME_LOCATION_POSITION = 'homeLocationPosition' as const
export function getHomeLocationIdFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID) || ''
}
export function getHomeLocationNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME) || ''
}
export function getHomeLocationPositionFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_LOCATION_POSITION) || ''
}
export const URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME = 'homePlanetarySystemName' as const
export function getHomePlanetarySystemNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME) || ''
}

export const URL_SEARCH_PARAM_KEY_PRODUCT_NAME = `productName`
export const URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME = 'productType' as const
export const URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME = 'productRarity' as const
export function getProductNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_NAME) || ''
}
export function getProductTypeNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME) || ''
}
export function getProductRarityNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME) || ''
}

export const URL_SEARCH_PARAM_KEY_MIN_PRICE = 'minPrice'
export const URL_SEARCH_PARAM_KEY_MAX_PRICE = 'maxPrice'
export const URL_SEARCH_PARAM_KEY_MIN_QUANTITY = 'minQuantity'
export const URL_SEARCH_PARAM_KEY_MAX_QUANTITY = 'maxQuantity'
export const URL_SEARCH_PARAM_KEY_MIN_PROFIT = 'minProfit'

export const URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID = 'movingEntityId' as const
export const URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME = 'movingEntityName' as const
export const URL_SEARCH_PARAM_KEY_MOVING_ENTITY_POSITION = 'movingEntityPosition' as const
export function getMovingEntityIdFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID) || ''
}
export function getMovingEntityNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME) || ''
}
export function getMovingEntityPositionFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_POSITION) || ''
}

export const URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME = 'movingEntityClass' as const
export function getMovingEntityClassNameFromUrlSearchParams(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME) || ''
}
