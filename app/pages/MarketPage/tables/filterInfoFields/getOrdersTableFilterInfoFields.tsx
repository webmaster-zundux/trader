import type { FilterInfoField } from '~/components/TableSelectedFilterInfo'
import type { MarketFilter } from '~/models/entities-filters/MarketFilter'
import { FormattedLocationNameForOrdersTableFilter } from './FormattedLocationNameForOrdersTableFilter'
import { FormattedPriceForOrdersTableFilter } from './FormattedPriceForOrdersTableFilter'
import { FormattedQuantityForOrdersTableFilter } from './FormattedQuantityForOrdersTableFilter'

type MarketFilterInfo = MarketFilter & {
  quantity?: number
  price?: number
}
export function getOrdersTableFilterInfoFields(): FilterInfoField<MarketFilterInfo>[] {
  return [
    {
      name: 'locationUuid',
      label: 'location',
      formatLabelAndValue: FormattedLocationNameForOrdersTableFilter,
    },
    {
      name: 'quantity',
      groupNames: ['minQuantity', 'maxQuantity'],
      formatLabelAndValue: FormattedQuantityForOrdersTableFilter,
    },
    {
      name: 'price',
      groupNames: ['minPrice', 'maxPrice'],
      formatLabelAndValue: FormattedPriceForOrdersTableFilter,
    },
  ]
}
