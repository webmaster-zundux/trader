import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import type { MarketFilter } from '~/models/entities-filters/MarketFilter'

export function FormattedPriceForOrdersTableFilter<
  T extends MarketFilter = MarketFilter
>({
  filterValue
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  if (!filterValue) {
    return undefined
  }

  let label = ''
  let value = ''

  const min = filterValue['minPrice']
  const max = filterValue['maxPrice']

  if (!min && !max) {
    return undefined
  }

  if (min && max) {
    label = 'price'
    value = `${min} - ${max}`
  } else if (min) {
    label = 'min price'
    value = `${min}`
  } else if (max) {
    label = 'max price'
    value = `${max}`
  }

  return {
    label,
    value,
  }
}
