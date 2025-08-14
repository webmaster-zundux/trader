import type { ChangeEventHandler, TextareaHTMLAttributes } from 'react'
import { memo, useCallback } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import styles from './TextareaField.module.css'

type TextareaFieldProps = {
  min?: number
  max?: number
  value?: string
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  autoFocusOnFirstRender?: boolean
} & Pick<TextareaHTMLAttributes<HTMLTextAreaElement>,
'id' | 'name' | 'required'
| 'minLength' | 'maxLength'
| 'defaultValue' | 'onChange' | 'disabled' | 'placeholder'
| 'autoComplete' | 'spellCheck'>
export const TextareaField = memo(function TextareaField({
  autoComplete = 'off',
  onFieldValueChange,
  name,
  value,
  autoFocusOnFirstRender,
  ...rest
}: TextareaFieldProps) {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(function handleChange(event) {
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

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLTextAreaElement>({ autoFocus: autoFocusOnFirstRender })

  return (
    <textarea
      ref={autoFocusTargetRef}
      autoComplete={autoComplete}
      className={styles.TextareaField}
      name={name}
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
})
