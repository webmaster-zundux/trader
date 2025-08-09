import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'
import type { SellOrder } from '../../../models/entities/SellOrder'

export const getEditSellOrderFormFields = (
  productsAsSelectOptions: SelectFieldOption[],
  locationsAsSelectOptions: SelectFieldOption[]
): FormField<SellOrder>[] => {
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
      name: 'locationUuid',
      label: 'location',
      type: 'select',
      required: true,
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no locations available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'productUuid',
      label: 'product',
      type: 'select',
      required: true,
      options: productsAsSelectOptions,
      chooseOptionLabel: 'choose a product',
      noOptionsLabel: 'no products available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'availableQuantity',
      label: 'stock',
      type: 'number',
      required: true,
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      valueType: 'float',
      pattern: '[0-9]+[.][0-9]{2}',
      step: '0.01',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    },
  ]
}
