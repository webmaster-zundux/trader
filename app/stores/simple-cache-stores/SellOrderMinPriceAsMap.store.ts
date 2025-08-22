import { type Location } from '~/models/entities/Location'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { SellOrder } from '~/models/entities/SellOrder'
import type { Order } from '~/models/Order'
import { createNameFromParts, FULL_NAME_PART_SEPARATOR } from '~/models/utils/createNameFromParts'
import { getLocationsAsMapSelector, useLocationsStore } from '../entity-stores/Locations.store'
import { getPlanetarySystemsAsMapSelector, usePlanetarySystemsStore } from '../entity-stores/PlanetarySystems.store'
import { getSellOrdersAsMapSelector, useSellOrdersStore } from '../entity-stores/SellOrders.store'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { createSimpleMapCacheStore } from './createSimpleMapCacheStore'

type SellOrderMinPriceMapItemKey = Order['productUuid']
type SellOrderMinPriceMapItemValue = number

export const useSellOrderMinPriceAsMapStore = createSimpleMapCacheStore<SellOrderMinPriceMapItemKey, SellOrderMinPriceMapItemValue>()

export function prepareDataSellOrderMinPriceAsMapStore() {
  const {
    isHydrating: isHydratingSellOrdersStore,
    isHydrated: isHydratedSellOrdersStore
  } = useSellOrdersStore.getState()
  const {
    isHydrating: isHydratingPlanetarySystemsStore,
    isHydrated: isHydratedPlanetarySystemsStore
  } = usePlanetarySystemsStore.getState()
  const {
    isHydrating: isHydratingLocationsStore,
    isHydrated: isHydratedLocationsStore
  } = useLocationsStore.getState()

  if (
    (isHydratingSellOrdersStore || !isHydratedSellOrdersStore)
    || (isHydratingPlanetarySystemsStore || !isHydratedPlanetarySystemsStore)
    || (isHydratingLocationsStore || !isHydratedLocationsStore)
  ) {
    return
  }

  const sellOrdersMap = getSellOrdersAsMapSelector()
  const locationsMap = getLocationsAsMapSelector()
  const planetarySystemsMap = getPlanetarySystemsAsMapSelector()

  replaceAllSellOrderMinPriceAsMapWithThrottle({
    sellOrdersMap,
    planetarySystemsMap,
    locationsMap,
  })
}

// useSellOrderMinPriceAsMapStore.setState({
//   prepareData: prepareDataSellOrderMinPriceAsMapStore
// })

// useSellOrdersStore.subscribe(function onLocationsStoreStateChange() {
//   prepareDataSellOrderMinPriceAsMapStore()
// })

// usePlanetarySystemsStore.subscribe(function onPlanetarySystemsStoreStateChange() {
//   prepareDataSellOrderMinPriceAsMapStore()
// })

export function getSellOrderMinPricesSelector() {
  return useSellOrderMinPriceAsMapStore.getState()
}

export function getSellOrderMinPricesAsMapSelector() {
  return getSellOrderMinPricesSelector().itemsMap
}

export function getSellOrderMinPricesAsArraySelector() {
  return getSellOrderMinPricesSelector().items()
}

export function getSellOrderProductMinPriceByUuidSelector(
  uuid: SellOrder['productUuid']
): SellOrderMinPriceMapItemValue | undefined {
  return getSellOrderMinPricesAsMapSelector().get(uuid)
}

function replaceAllSellOrderMinPriceAsMapWithThrottle({
  sellOrdersMap,
  planetarySystemsMap,
  locationsMap,
}: {
  sellOrdersMap: Map<SellOrder['uuid'], SellOrder>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  locationsMap: Map<Location['uuid'], Location>
}): void {
  const cacheStoreState = useSellOrderMinPriceAsMapStore.getState()

  const isProcessing = cacheStoreState.isProcessing

  if (isProcessing) {
    return
  }

  cacheStoreState.setIsProcessing(true)
  window.setTimeout(function createSelectOptionsByTimeoutHandler() {
    const sellOrderMinPriceMap = createSellOrderMinPriceMap({
      sellOrdersMap,
      planetarySystemsMap,
      locationsMap,
    })

    cacheStoreState.replaceAll(sellOrderMinPriceMap)

    cacheStoreState.setIsProcessing(false)
  }, 0)
}

export function createLocationFullNameFromParts({
  id,
  name,
  planetarySystemName,
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  id?: Location['id']
  name?: Location['name']
  planetarySystemName?: PlanetarySystem['name']
  reverseOrder?: boolean
  namePartSeparator?: string
}): string {
  const fullName = createNameFromParts([
    id,
    name,
  ], false, ' ')

  let nameParts = [
    fullName,
    planetarySystemName,
  ].filter(v => !!v)

  if (reverseOrder) {
    nameParts = nameParts.reverse()
  }

  return nameParts.join(namePartSeparator)
}

export function createLocationFullName({
  location,
  planetarySystemsMap,
  isUsingNoDataTextForEmptyParts = {},
  reverseOrder = false,
  namePartSeparator = FULL_NAME_PART_SEPARATOR,
}: {
  location: Location
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  isUsingNoDataTextForEmptyParts?: { id?: boolean, planetarySystem?: boolean }
  reverseOrder?: boolean
  namePartSeparator?: string
}): string {
  const noIdData = isUsingNoDataTextForEmptyParts.id ? '(no-id)' : ''

  const planetarySystemUuid = location.planetarySystemUuid
  const planetarySystem = planetarySystemUuid ? planetarySystemsMap.get(planetarySystemUuid) : undefined
  const noPlanetarySystemData = isUsingNoDataTextForEmptyParts.planetarySystem ? '(no planetary system data)' : ''

  return createLocationFullNameFromParts({
    id: location.id ?? noIdData,
    name: location.name,
    planetarySystemName: planetarySystem?.name ?? noPlanetarySystemData,
    reverseOrder,
    namePartSeparator,
  })
}

function createSellOrderMinPriceMap({
  sellOrdersMap,
  // planetarySystemsMap,
  // locationsMap,
}: {
  sellOrdersMap: Map<SellOrder['uuid'], SellOrder>
  planetarySystemsMap: Map<PlanetarySystem['uuid'], PlanetarySystem>
  locationsMap: Map<Location['uuid'], Location>
}): Map<SellOrderMinPriceMapItemKey, SellOrderMinPriceMapItemValue> {
  const sellOrderMinPriceMap = new Map<SellOrderMinPriceMapItemKey, SellOrderMinPriceMapItemValue>()

  const sellOrders = getMapValuesAsArray(sellOrdersMap)
  // const planetarySystems = getMapValuesAsArray(planetarySystemsMap) // todo - use for filtering
  // const locations = getMapValuesAsArray(locationsMap) // todo - use for filtering

  sellOrders.forEach(function forEach(sellOrder) {
    const sellOrderProductUuid = sellOrder.productUuid
    const sellOrderPrice = sellOrder.price
    const sellOrderProductMinPrice = sellOrderMinPriceMap.get(sellOrderProductUuid)

    if (
      sellOrderProductMinPrice === undefined
      || !Number.isFinite(sellOrderProductMinPrice)
      || sellOrderProductMinPrice > sellOrderPrice
    ) {
      sellOrderMinPriceMap.set(sellOrderProductUuid, sellOrderPrice)
    }
  })

  return sellOrderMinPriceMap
}
