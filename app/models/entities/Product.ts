import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_PRODUCT = 'product' as const

export type Product = Entity & {
  entityType: typeof ENTITY_TYPE_PRODUCT

  name: string // uniq
  productTypeUuid: string
  productRarityUuid: string
  image?: string
}

export type ProductAttributes = keyof Product

export const PRODUCT_ATTRIBUTES: ProductAttributes[] = ([
  'uuid',
  'entityType',
  'name',
  'productTypeUuid',
  'productRarityUuid',
  'image'
] as const) satisfies ProductAttributes[]

export const PRODUCT_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(PRODUCT_ATTRIBUTES)

export function isProduct(value: unknown): value is Product {
  return ((value as Product)?.entityType === ENTITY_TYPE_PRODUCT)
}
