import type { ChangeEventHandler, InputHTMLAttributes } from 'react'
import { memo, useCallback } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import styles from './FileField.module.css'

type FileFieldProps = {
  min?: number
  max?: number
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  autoFocusOnFirstRender?: boolean
} & Pick<InputHTMLAttributes<HTMLInputElement>,
'id' | 'name' | 'required'
| 'onChange' | 'disabled' | 'accept'>
export const FileField = memo(function FileField({
  onFieldValueChange,
  name,
  autoFocusOnFirstRender,
  ...rest
}: Omit<FileFieldProps, 'type'>) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
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
      type="file"
      className={styles.FileField}
      name={name}
      onChange={handleChange}
      {...rest}
    />
  )
})
