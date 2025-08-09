import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'

export function getEditMovingEntityFormFields({
  movingEntityClassesAsSelectOptions,
  locationsAsSelectOptions,
}: {
  movingEntityClassesAsSelectOptions: SelectFieldOption[]
  locationsAsSelectOptions: SelectFieldOption[]
}): FormField<MovingEntity>[] {
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
      name: 'originalId',
      label: 'original Id',
      uppercase: true,
    },
    {
      name: 'movingEntityClassUuid',
      label: 'class',
      type: 'select',
      options: movingEntityClassesAsSelectOptions,
      chooseOptionLabel: 'choose a moving object class',
      noOptionsLabel: 'no moving object classes available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'name',
      required: true,
    },
    {
      name: 'position',
    },
    {
      name: 'locationUuid',
      label: 'current location',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no locations available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'destinationLocationUuid',
      label: 'destination',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no locations available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'homeLocationUuid',
      label: 'home location',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no locations available',
      allowToSelectNoValueOption: true,
    },
    {
      name: 'cargo',
      label: 'cargo / freight bay',
    },
    {
      name: 'combatShield',
      label: 'shield',
    },
    {
      name: 'combatLaser',
      label: 'laser',
    },
    {
      name: 'combatMissiles',
      label: 'missiles',
      type: 'number',
      valueType: 'integer',
      pattern: '[0-9]+',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      step: '1',
    },
    {
      name: 'note',
      type: 'multiline-text',
    },
  ]
}
