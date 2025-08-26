import { memo, useMemo } from 'react'
import styles from './FormFieldList.module.css'
import { FormFieldWithLabel } from './FormFieldWithLabel'
import { getFlatFormFields, isFormFieldRowContainer, isNotFormFieldHidden, type FormField, type FormFieldNotHidden, type FormFieldsRowContainer } from './FormFieldWithLabel.const'
import { FormFieldWrapper } from './FormFieldWrapper'

interface FormFieldListProps<T> {
  formFields: FormField<T>[] | FormFieldsRowContainer<T>[]
  item?: T
}
export const FormFieldList = memo(function FormFieldList<T>({
  formFields,
  item,
}: FormFieldListProps<T>) {
  const firstVisibleFormFieldName = useMemo(function firstVisibleFormFieldNameMemo(): Extract<keyof T, string> | undefined {
    const flatFormFields = getFlatFormFields(formFields)
    const visibleFlatFormFields = flatFormFields.filter(isNotFormFieldHidden)
    const firstVisibleFormField: FormFieldNotHidden<T> | undefined = visibleFlatFormFields[0]

    return firstVisibleFormField?.name
  }, [formFields])

  return (
    <div className={styles.FieldList}>
      <div className={styles.FieldsContainer}>
        {formFields.map((field, fieldIndex) => {
          if (isFormFieldRowContainer(field)) {
            const {
              label,
              labelForFieldName,
              fields: subFields,
              type,
            } = field

            return (
              <FormFieldWrapper
                key={fieldIndex}
                name={labelForFieldName}
                label={label}
                type={type}
              >
                <div className={styles.Row}>
                  {subFields.map((subField) => {
                    const fieldValue = item?.[subField.name]
                    const autoFocusOnFirstRender = firstVisibleFormFieldName === subField.name

                    return (
                      <FormFieldWithLabel
                        key={subField.name}
                        field={subField}
                        autoFocusOnFirstRender={autoFocusOnFirstRender}
                        fieldValue={fieldValue}
                        hideFieldLabel
                      />
                    )
                  })}
                </div>
              </FormFieldWrapper>
            )
          }

          const fieldValue = item?.[field.name]
          const autoFocusOnFirstRender = firstVisibleFormFieldName === field.name

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
    </div>
  )
})
