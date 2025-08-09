import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'

export function getEditMovingEntityClassFormFields(): FormField<MovingEntityClass>[] {
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
      required: true,
    },
    {
      name: 'note',
    },
    {
      name: 'image',
      type: 'file',
      accept: 'image/*',
    },
  ]
}
