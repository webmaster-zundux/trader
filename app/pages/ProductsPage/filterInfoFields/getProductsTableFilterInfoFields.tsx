import type { ProductFilter } from '~/models/entities-filters/ProductFilter'
import type { FilterInfoField } from '../../../components/TableSelectedFilterInfo'
import { FormattedProductRarityNameForProductsTableFilter } from './FormattedProductRarityNameForProductsTableFilter'
import { FormattedProductTypeNameForProductsTableFilter } from './FormattedProductTypeNameForProductsTableFilter'

export function getProductsTableFilterInfoFields(): FilterInfoField<ProductFilter>[] {
  return [
    {
      name: 'productTypeUuid',
      label: 'type',
      formatLabelAndValue: FormattedProductTypeNameForProductsTableFilter,
    },
    {
      name: 'productRarityUuid',
      label: 'rarity',
      formatLabelAndValue: FormattedProductRarityNameForProductsTableFilter,
    },
  ]
}
