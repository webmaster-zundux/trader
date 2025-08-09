import type { InputHTMLAttributes } from 'react'
import { memo, useMemo } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import styles from './NumberField.module.css'

export type NumberFieldProps = {
  min?: number
  max?: number
  formatValue?: (value?: string | readonly string[] | number | undefined) => string | number | undefined
  autoFocusOnFirstRender?: boolean
} & Pick<InputHTMLAttributes<HTMLInputElement>,
'id' | 'name' | 'required' |
'defaultValue' | 'onChange' |
'pattern' | 'step' | 'disabled' | 'placeholder'
>
export const NumberField = memo(function NumberField({
  name,
  min,
  max,
  formatValue,
  defaultValue,
  autoFocusOnFirstRender,
  ...rest
}: NumberFieldProps) {
  const minValue = min ?? Number.MIN_SAFE_INTEGER
  const maxValue = max ?? Number.MAX_SAFE_INTEGER

  const minimalIntegerValue = Math.max(minValue, Number.MIN_SAFE_INTEGER)
  const maximalIntegerValue = Math.min(maxValue, Number.MAX_SAFE_INTEGER)

  const formattedDefaultValue = useMemo(function formattedDefaultValueMemo() {
    return (typeof formatValue === 'function')
      ? formatValue(defaultValue)
      : defaultValue
  }, [formatValue, defaultValue])

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLInputElement>({ autoFocus: autoFocusOnFirstRender })

  return (
    <>
      <input
        ref={autoFocusTargetRef}
        autoComplete="off"
        type="number"
        className={styles.NumberField}
        name={name}
        min={minimalIntegerValue}
        max={maximalIntegerValue}
        defaultValue={formattedDefaultValue}
        {...rest}
      />
    </>
  )
})
