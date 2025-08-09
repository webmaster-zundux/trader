import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_PRODUCT_TYPE = 'product-type' as const

export type ProductType = Entity & {
  entityType: typeof ENTITY_TYPE_PRODUCT_TYPE

  name: string // uniq
}
export type ProductTypeAttributes = keyof ProductType

export const PRODUCT_TYPE_ATTRIBUTES: ProductTypeAttributes[] = ([
  'uuid',
  'entityType',
  'name'
] as const) satisfies ProductTypeAttributes[]

export const PRODUCT_TYPE_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(PRODUCT_TYPE_ATTRIBUTES)

export function isProductType(value: unknown): value is ProductType {
  return ((value as ProductType)?.entityType === ENTITY_TYPE_PRODUCT_TYPE)
}
