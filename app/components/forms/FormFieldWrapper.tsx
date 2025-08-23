import type { PropsWithChildren } from 'react'
import { memo } from 'react'
import styles from './FormFieldWrapper.module.css'

interface FormFieldWrapperProps extends PropsWithChildren {
  name?: string
  label?: string
  hideFieldLabel?: boolean
  required?: boolean
}
export const FormFieldWrapper = memo(function FormFieldWrapper({
  name,
  label,
  hideFieldLabel,
  required,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={styles.FormFieldWrapper}>
      {!hideFieldLabel && !!label && (
        <label
          htmlFor={name}
          className={styles.FieldLabel}
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
