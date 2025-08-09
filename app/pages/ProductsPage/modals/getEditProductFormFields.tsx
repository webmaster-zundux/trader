import type { Product } from '../../../models/entities/Product'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'

export function getEditProductFormFields(
  productRaritiesAsSelectOptions: SelectFieldOption[] = [],
  productTypesAsSelectOptions: SelectFieldOption[] = []
): FormField<Product>[] {
  return [
    {
      name: 'uuid',
      type: 'hidden',
    },
    {
      name: 'entityType',
      type: 'hidden',
    },
    {
      name: 'name',
      label: 'name',
      required: true,
    },
    {
      name: 'productTypeUuid',
      label: 'type',
      type: 'select',
      required: true,
      options: productTypesAsSelectOptions,
      chooseOptionLabel: 'choose a type',
      noOptionsLabel: 'no types available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'productRarityUuid',
      label: 'rarity',
      type: 'select',
      required: true,
      options: productRaritiesAsSelectOptions,
      chooseOptionLabel: 'choose a rarity',
      noOptionsLabel: 'no rarities available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'image',
      type: 'file',
      accept: 'image/*',
    },
  ]
}
