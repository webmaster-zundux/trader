import type { PropsWithChildren } from 'react'
import { memo } from 'react'
import styles from './FormFieldWrapper.module.css'

const ALLOWED_FIELD_TYPES_FOR_HTML_ELEMENT_LABEL_ATTRIBUTE_FOR = ['number', 'text', 'multiline-text', 'select', 'checkbox', 'radio', 'file']

interface FormFieldWrapperProps extends PropsWithChildren {
  name?: string
  label?: string
  type?: string
  hideFieldLabel?: boolean
  required?: boolean
}
export const FormFieldWrapper = memo(function FormFieldWrapper({
  name,
  label,
  type = 'text',
  hideFieldLabel,
  required,
  children,
}: FormFieldWrapperProps) {
  const additionalAttributes: { htmlFor?: string } = {}

  if (type && ALLOWED_FIELD_TYPES_FOR_HTML_ELEMENT_LABEL_ATTRIBUTE_FOR.includes(type)) {
    additionalAttributes.htmlFor = name
  }

  return (
    <div className={styles.FormFieldWrapper}>
      {!hideFieldLabel && !!label && (
        <label
          className={styles.FieldLabel}
          {...additionalAttributes}
        >
          {label}
          {required ? (
            <span className={styles.RequiredLabel}>
              (required)
            </span>
          ) : ''}
        </label>
      )}
      {children}
    </div>
  )
})
