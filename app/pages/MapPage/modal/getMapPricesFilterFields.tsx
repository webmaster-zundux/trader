import type { SelectFieldOption } from '~/components/forms/fields/SelectField'
import type { FilterField } from '~/components/tables/hooks/useTableFilter'
import type { MarketFilter } from '~/models/entities-filters/MarketFilter'
import { isBuyOrder, type BuyOrder } from '~/models/entities/BuyOrder'
import { isSellOrder, type SellOrder } from '~/models/entities/SellOrder'

let sellOrders = new Array<SellOrder>()
let buyOrders = new Array<BuyOrder>()

type MarketFilterField = FilterField<SellOrder | BuyOrder, Omit<MarketFilter, 'planetarySystemUuid'>>

export const getMapPricesFilterFields = (
  locationsAsSelectOptions: SelectFieldOption[]
): MarketFilterField[] => {
  return [
    {
      name: 'locationUuid',
      label: 'location',
      // type: 'hidden',
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

    // todo MEOW =^-^=
    {
      name: 'minProfit',
      label: 'min profit',
      type: 'number',
      valueType: 'float',
      pattern: '[0-9]+[.][0-9]{2}',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      step: '0.01',
      filterPredicate: (item, filterValue, items) => {
        const minProfit = filterValue.minProfit

        if (minProfit === undefined) {
          return true
        }

        // if (isSellOrder(item)) {
        //   if (!Object.is(items, sellOrders)) {
        //     sellOrders = items as SellOrder[]
        //     prepareDataSellOrderMinPriceAsMapStore()
        //   }

        //   const sellOrderMinPrice = getSellOrderProductMinPriceByUuidSelector(item.productUuid)

        //   if (sellOrderMinPrice === undefined) {
        //     return true
        //   }

        //   const sellOrderMaxPriceForMinProfit = buyOrderMaxPrice - minProfit
        // }

        // todo - get max item's price of buy orders
        // todo - get min item's price of sell orders
        // for the selected product
        // in the selected planetary system
        const sellOrderMinPrice = 0
        const buyOrderMaxPrice = 0
        const sellOrderMaxPriceForMinProfit = buyOrderMaxPrice - minProfit
        const buyOrderMinPriceForMinProfit = sellOrderMinPrice + minProfit

        if (
          isSellOrder(item)
          && (item.price >= sellOrderMaxPriceForMinProfit)
        ) {
          return true
        } else if (
          isBuyOrder(item)
          && (item.price <= buyOrderMinPriceForMinProfit)
        ) {
          return true
        }

        return false
      },
    },
  ]
}
