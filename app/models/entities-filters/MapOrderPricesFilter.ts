import type { Location } from '../entities/Location'
import type { PlanetarySystem } from '../entities/PlanetarySystem'
import type { Product } from '../entities/Product'

export type MapOrderPricesFilter = {
  locationUuid?: Location['uuid'] | PlanetarySystem['uuid']
  productUuid?: Product['uuid']

  minPrice?: number
  maxPrice?: number

  minQuantity?: number
  maxQuantity?: number

  minProfit?: number
}
