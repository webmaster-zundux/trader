import type { SelectHTMLAttributes } from 'react'
import { memo, useCallback, useMemo } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import type { Entity } from '../../../models/Entity'
import styles from './CheckboxGroupField.module.css'

export type CheckboxGroupFieldItem = {
  value: string
  label: string
  disabled?: boolean
}

type CheckboxGroupFieldProps = {
  items: CheckboxGroupFieldItem[]
  noItemsLabel?: string
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  defaultValue?: Entity['uuid'][]
  value?: Entity['uuid'][]
  autoFocusOnFirstRender?: boolean
} & Pick<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'name' | 'required' | 'onChange' | 'disabled'>
export const CheckboxGroupField = memo(function CheckboxGroupField({
  items,
  noItemsLabel = 'no items',
  defaultValue = [],
  disabled,
  name,
  autoFocusOnFirstRender,
}: CheckboxGroupFieldProps) {
  const isFieldDisabled = useMemo(() => disabled, [disabled])

  const isSelectedItem = useCallback((itemUuid: Entity['uuid']): boolean => {
    const selectedItem = defaultValue.find(selectedUuid => selectedUuid === itemUuid)

    return !!selectedItem
  }, [defaultValue])

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLInputElement>({ autoFocus: autoFocusOnFirstRender })

  return (
    <div
      className={styles.CheckboxGroupField}
    >
      {!items.length && (
        <div
          className={styles.NoItemsLabel}
        >
          {noItemsLabel}
        </div>
      )}

      {items.length && (
        <>
          {items.map(({ value, label, disabled }, index) => (
            <div
              key={`${index}-${value}`}
              className={styles.Item}
            >
              <input
                ref={index === 0 ? autoFocusTargetRef : null}
                type="checkbox"
                name={name}
                value={value}
                id={value}
                disabled={disabled || isFieldDisabled}
                defaultChecked={isSelectedItem(value)}
                className={styles.Checkbox}
              />
              <label
                htmlFor={value}
                className={styles.CheckboxLabel}
              >
                {label}
              </label>
            </div>
          ))}
        </>
      )}
    </div>
  )
})
