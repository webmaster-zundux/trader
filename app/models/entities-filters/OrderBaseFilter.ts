import type { Location } from '../entities/Location'
import type { EntityBaseFilter } from './EntityBaseFilter'

export type OrderBaseFilter = EntityBaseFilter & {

  locationUuid?: Location['uuid']

  minPrice?: number
  maxPrice?: number

  minQuantity?: number
  maxQuantity?: number
}
