import type { ChangeEventHandler, InputHTMLAttributes } from 'react'
import { memo, useCallback } from 'react'
import { cn } from '~/utils/ui/ClassNames'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import styles from './InputField.module.css'

type InputFieldProps = {
  type?: 'text' | 'number' | 'file'
  min?: number
  max?: number
  value?: string
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  autoFocusOnFirstRender?: boolean
  uppercase?: boolean
} & Pick<InputHTMLAttributes<HTMLInputElement>,
'id' | 'name' | 'required' |
'minLength' | 'maxLength' |
'defaultValue' | 'onChange' |
'pattern' | 'step' | 'disabled' | 'placeholder' |
'autoComplete' | 'accept' | 'spellCheck'>
export const InputField = memo(function InputField({
  type = 'text',
  autoComplete = 'off',
  onFieldValueChange,
  name,
  value,
  autoFocusOnFirstRender,
  uppercase,
  ...rest
}: InputFieldProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(function handleChange(event) {
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

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLInputElement>({ autoFocus: autoFocusOnFirstRender })

  return (
    <input
      ref={autoFocusTargetRef}
      autoComplete={autoComplete}
      type={type}
      className={cn([
        styles.InputField,
        uppercase && styles.Uppercase,
      ])}
      name={name}
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
})
