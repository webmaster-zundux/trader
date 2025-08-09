import { memo, useMemo } from 'react'
import { FormFieldWithLabel } from './FormFieldWithLabel'
import { isFormFieldHidden, isNotFormFieldHidden, type FormField } from './FormFieldWithLabel.const'
import styles from './FormFieldList.module.css'

interface FormFieldListProps<T> {
  formFields: FormField<T>[]
  item?: T
}
export const FormFieldList = memo(function FormFieldList<T>({
  formFields,
  item,
}: FormFieldListProps<T>) {
  const hiddenFormFields = useMemo(() => formFields.filter(isFormFieldHidden), [formFields])
  const visibleFormFields = useMemo(() => formFields.filter(isNotFormFieldHidden), [formFields])

  return (
    <div className={styles.FieldList}>
      {hiddenFormFields.map((field) => {
        const fieldValue = item?.[field.name]

        return (
          <input
            key={field.name}
            type="hidden"
            id={field.name}
            name={field.name}
            required={field.required}
            defaultValue={fieldValue as string ?? field.defaultValue}
          />
        )
      })}

      {visibleFormFields.map((field, fieldIndex) => {
        const fieldValue = item?.[field.name]
        const autoFocusOnFirstRender = fieldIndex === 0

        return (
          <FormFieldWithLabel
            key={field.name}
            field={field}
            autoFocusOnFirstRender={autoFocusOnFirstRender}
            fieldValue={fieldValue}
          />
        )
      })}
    </div>
  )
})
