import type { ChangeEventHandler, SelectHTMLAttributes } from 'react'
import { Fragment, memo, useCallback } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import styles from './SelectField.module.css'

export type SelectFieldOption = {
  value?: string
  label: string
  level?: number
  disabled?: boolean
}

type SelectFieldProps = {
  options: SelectFieldOption[]
  showNoValueOption?: boolean
  chooseOptionLabel?: string
  noOptionsLabel?: string
  allowToSelectNoValueOption?: boolean
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  autoFocusOnFirstRender?: boolean
} & Pick<SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'name' | 'required' | 'onChange' | 'defaultValue' | 'disabled' | 'value'
>
export const SelectField = memo(function SelectField({
  options,
  showNoValueOption = true,
  chooseOptionLabel = 'choose an option',
  noOptionsLabel = 'no options',
  disabled,
  allowToSelectNoValueOption = false,
  onFieldValueChange,
  name,
  autoFocusOnFirstRender,
  ...rest
}: SelectFieldProps) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
    if (typeof onFieldValueChange !== 'function') {
      return
    }

    if (!name) {
      console.error('Error. Form field must have name')
      return
    }

    const newValue = event.target.value

    onFieldValueChange(name, newValue)
  }, [onFieldValueChange, name])

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLSelectElement>({ autoFocus: autoFocusOnFirstRender })

  return (
    <select
      ref={autoFocusTargetRef}
      autoComplete="off"
      className={styles.SelectField}
      disabled={!options?.length || disabled}
      name={name}
      onChange={handleChange}
      {...rest}
    >
      {!options.length && (
        <option
          value=""
          className={styles.NoOptionsLabel}
        >
          {noOptionsLabel}
        </option>
      )}

      {options.length && (
        <>
          {showNoValueOption && (
            <option
              value=""
              className={styles.DefaultSelectOption}
              {...{
                disabled: !allowToSelectNoValueOption,
              }}
            >
              {chooseOptionLabel}
            </option>
          )}

          {options.map(({ value, label, level, disabled }, optionIndex) => (
            <option
              key={`${optionIndex}-${value}`}
              value={value}
              disabled={disabled}
              className={styles.SelectOption}
            >
              {Boolean(level) && (
                <>
                  {Array(level).fill('').map((v, i) =>
                    (<Fragment key={i}>&nbsp;&nbsp;&nbsp;</Fragment>)
                  )}
                </>
              )}

              {label}

            </option>
          ))}
        </>
      )}
    </select>
  )
})
