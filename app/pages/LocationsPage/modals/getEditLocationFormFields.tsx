import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'
import { type Location } from '../../../models/entities/Location'

export function getEditLocationFormFields(
  planetarySystemsAsSelectOptions: SelectFieldOption[] = [],
  locationTypesAsSelectOptions: SelectFieldOption[] = []
): FormField<Location>[] {
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
      name: 'id',
      uppercase: true,
    },
    {
      name: 'name',
      required: true,
    },
    {
      name: 'locationTypeUuid',
      label: 'type',
      type: 'select',
      options: locationTypesAsSelectOptions,
      chooseOptionLabel: 'choose a location type',
      noOptionsLabel: 'no location types available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'planetarySystemUuid',
      label: 'planetary system',
      type: 'select',
      options: planetarySystemsAsSelectOptions,
      chooseOptionLabel: 'choose a planetary system',
      noOptionsLabel: 'no planetary systems available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'position',
    },
  ]
}
