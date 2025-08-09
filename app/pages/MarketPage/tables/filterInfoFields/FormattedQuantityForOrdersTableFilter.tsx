import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import type { MarketFilter } from '~/models/entities-filters/MarketFilter'

export function FormattedQuantityForOrdersTableFilter<
  T extends MarketFilter = MarketFilter
>({
  filterValue,
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  if (!filterValue) {
    return undefined
  }

  const min = filterValue['minQuantity']
  const max = filterValue['maxQuantity']

  if (!min && !max) {
    return undefined
  }

  let label = ''
  let value = ''

  if (min && max) {
    label = 'quantity'
    value = `${min} - ${max}`
  } else if (min) {
    label = 'min quantity'
    value = `${min}`
  } else if (max) {
    label = 'max quantity'
    value = `${max}`
  }

  return {
    label,
    value,
  }
}
