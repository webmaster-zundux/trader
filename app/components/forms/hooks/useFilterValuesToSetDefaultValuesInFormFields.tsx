import { useMemo } from 'react'
import type { Entity } from '../../../models/Entity'
import type { EntityBaseFilter } from '../../../models/entities-filters/EntityBaseFilter'
import type { FormField } from '~/components/forms/FormFieldWithLabel.const'

export const useFilterValuesAsDefaultValuesInFormFields = <
  V extends EntityBaseFilter = EntityBaseFilter,
  T extends Entity = Entity,
  F extends FormField<T> = FormField<T>
>(
  formFields: F[] = [],
  filterValue?: V
): F[] => {
  const formFieldsWithDefaultValues: F[] = useMemo(() => {
    if (!filterValue) {
      return formFields
    }

    return formFields.map((formField) => {
      const formFieldName = formField.name
      // @ts-expect-error - todo fix generic type of FormField
      const filterValueForFormField = filterValue[formFieldName]

      if (filterValueForFormField) {
        const formFieldWithDefaultValue: F = {
          ...formField,
          defaultValue: filterValueForFormField,
        }

        return formFieldWithDefaultValue
      }

      return formField
    })
  }, [formFields, filterValue])

  return formFieldsWithDefaultValues
}
