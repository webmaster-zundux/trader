import type { PropsWithChildren } from 'react'
import { memo } from 'react'
import styles from './FormFieldContainer.module.css'

interface FormFieldContainerProps extends PropsWithChildren {
  name?: string
  label?: string
  hideFieldLabel?: boolean
  required?: boolean
}
export const FormFieldContainer = memo(function FormFieldContainer({
  name,
  label,
  hideFieldLabel,
  required,
  children,
}: FormFieldContainerProps) {
  return (
    <div className={styles.FieldContainer}>
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
