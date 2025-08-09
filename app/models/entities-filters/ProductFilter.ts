import type { ProductRarity } from '../entities/ProductRarity'
import type { ProductType } from '../entities/ProductType'
import type { EntityBaseFilter } from './EntityBaseFilter'

export type ProductFilter = EntityBaseFilter & {
  productTypeUuid?: ProductType['uuid']
  productRarityUuid?: ProductRarity['uuid']
}
