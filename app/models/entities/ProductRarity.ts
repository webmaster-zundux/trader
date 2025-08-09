import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_PRODUCT_RARITY = 'product-rarity' as const

export type ProductRarity = Entity & {
  entityType: typeof ENTITY_TYPE_PRODUCT_RARITY

  name: string // uniq
  value: number // uniq
}
export type ProductRarityAttributes = keyof ProductRarity

export const PRODUCT_RARITY_ATTRIBUTES: ProductRarityAttributes[] = ([
  'uuid',
  'entityType',
  'name',
  'value'
] as const) satisfies ProductRarityAttributes[]

export const PRODUCT_RARITY_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(PRODUCT_RARITY_ATTRIBUTES)

export function isProductRarity(value: unknown): value is ProductRarity {
  return ((value as ProductRarity)?.entityType === ENTITY_TYPE_PRODUCT_RARITY)
}
