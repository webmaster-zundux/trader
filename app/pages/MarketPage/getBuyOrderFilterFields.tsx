import type { SelectFieldOption } from '../../components/forms/fields/SelectField'
import { marketFilterLocationUuidPredicate } from './marketFilterLocationUuidPredicate'
import type { BuyOrderFilterField } from './modals/BuyOrderFilterDialog'

export const getBuyOrderFilterFields = (
  locationsAsSelectOptions: SelectFieldOption[]
): BuyOrderFilterField[] => {
  return [
    {
      name: 'locationUuid',
      label: 'location',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no location available',
      allowToSelectNoValueOption: true,
      filterPredicate: marketFilterLocationUuidPredicate,
    },
    {
      name: 'minQuantity',
      label: 'min quantity',
      type: 'number',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      filterPredicate: (item, filterValue) => {
        if (filterValue.minQuantity === undefined) {
          return true
        }

        return item.desirableQuantity >= filterValue.minQuantity
      },
    },
    {
      name: 'maxQuantity',
      label: 'max quantity',
      type: 'number',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      filterPredicate: (item, filterValue) => {
        if (filterValue.maxQuantity === undefined) {
          return true
        }

        return item.desirableQuantity <= filterValue.maxQuantity
      },
    },

    {
      name: 'minPrice',
      label: 'min price',
      type: 'number',
      valueType: 'float',
      pattern: '[0-9]+[.][0-9]{2}',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      step: '0.01',
      filterPredicate: (item, filterValue) => {
        if (filterValue.minPrice === undefined) {
          return true
        }

        return item.price >= filterValue.minPrice
      },
    },
    {
      name: 'maxPrice',
      label: 'max price',
      type: 'number',
      valueType: 'float',
      pattern: '[0-9]+[.][0-9]{2}',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      step: '0.01',
      filterPredicate: (item, filterValue) => {
        if (filterValue.maxPrice === undefined) {
          return true
        }

        return item.price <= filterValue.maxPrice
      },
    },
  ]
}
