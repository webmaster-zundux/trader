import type { MarketFilter } from '~/models/entities-filters/MarketFilter'
import { isBuyOrder, type BuyOrder } from '~/models/entities/BuyOrder'
import { isSellOrder, type SellOrder } from '~/models/entities/SellOrder'
import type { SelectFieldOption } from '../../components/forms/fields/SelectField'
import type { FilterField } from '../../components/tables/hooks/useTableFilter'

type MarketFilterField = FilterField<SellOrder | BuyOrder, Omit<MarketFilter, 'planetarySystemUuid'>>

export const getMarketFilterFields = (
  locationsAsSelectOptions: SelectFieldOption[]
): MarketFilterField[] => {
  return [
    {
      name: 'locationUuid',
      label: 'location',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no location available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.locationUuid === filterValue.locationUuid
      },
    },
    {
      type: 'row-container',
      label: 'quantity',
      labelForFieldName: 'minQuantity',
      // delimiter: ' - ',
      fields: [
        {
          name: 'minQuantity',
          label: 'min',
          type: 'number',
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          filterPredicate: (item, filterValue) => {
            const minQuantity = filterValue.minQuantity

            if (minQuantity === undefined) {
              return true
            }

            if (isSellOrder(item)) {
              return item.availableQuantity >= minQuantity
            } else if (isBuyOrder(item)) {
              return item.desirableQuantity >= minQuantity
            }

            return true
          },
        },
        {
          name: 'maxQuantity',
          label: 'max',
          type: 'number',
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          filterPredicate: (item, filterValue) => {
            const maxQuantity = filterValue.maxQuantity

            if (maxQuantity === undefined) {
              return true
            }

            if (isSellOrder(item)) {
              return item.availableQuantity <= maxQuantity
            } else if (isBuyOrder(item)) {
              return item.desirableQuantity <= maxQuantity
            }

            return true
          },
        },
      ],
    },
    {
      type: 'row-container',
      label: 'price',
      labelForFieldName: 'minPrice',
      // delimiter: ' - ',
      fields: [
        {
          name: 'minPrice',
          label: 'min',
          type: 'number',
          valueType: 'float',
          pattern: '[0-9]+[.][0-9]{2}',
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          step: '0.01',
          filterPredicate: (item, filterValue) => {
            const minPrice = filterValue.minPrice

            if (minPrice === undefined) {
              return true
            }

            return item.price >= minPrice
          },
        },
        {
          name: 'maxPrice',
          label: 'max',
          type: 'number',
          valueType: 'float',
          pattern: '[0-9]+[.][0-9]{2}',
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          step: '0.01',
          filterPredicate: (item, filterValue) => {
            const maxPrice = filterValue.maxPrice

            if (maxPrice === undefined) {
              return true
            }

            return item.price <= maxPrice
          },
        },
      ],
    },
  ]
}
