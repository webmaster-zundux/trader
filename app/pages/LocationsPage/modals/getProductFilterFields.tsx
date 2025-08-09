import type { ProductFilter } from '~/models/entities-filters/ProductFilter'
import type { Product } from '~/models/entities/Product'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'
import type { FilterField } from '../../../components/tables/hooks/useTableFilter'

type ProductFilterField = FilterField<Product, ProductFilter>

export const getProductFilterFields = (
  productTypesAsSelectOptions: SelectFieldOption[],
  raritiesAsSelectOptions: SelectFieldOption[]
): ProductFilterField[] => {
  return [
    {
      name: 'productTypeUuid',
      label: 'type',
      type: 'select',
      options: productTypesAsSelectOptions,
      chooseOptionLabel: 'choose a product type',
      noOptionsLabel: 'no product type available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.productTypeUuid === filterValue.productTypeUuid
      },
    },
    {
      name: 'productRarityUuid',
      label: 'rarity',
      type: 'select',
      options: raritiesAsSelectOptions,
      chooseOptionLabel: 'choose a product rarity',
      noOptionsLabel: 'no product rarity available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.productRarityUuid === filterValue.productRarityUuid
      },
    },
  ]
}
