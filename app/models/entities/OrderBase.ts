import type { Entity } from '../Entity'

export type OrderBase = Entity & {
  productUuid: string // is a part of uniq pair [productUuid, locationUuid]
  locationUuid: string // is a part of uniq pair [productUuid, locationUuid]
  price: number
}
