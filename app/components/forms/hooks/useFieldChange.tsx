import type { ChangeEvent, ChangeEventHandler, RefObject } from 'react'
import { useEffect } from 'react'

export const getFormFieldElement = <
  T
  extends HTMLInputElement | HTMLSelectElement = HTMLInputElement | HTMLSelectElement,
>(
  fieldName: string,
  fieldType: 'input' | 'select' = 'input',
  formElement?: HTMLFormElement
): T | undefined => {
  if (!formElement) {
    return undefined
  }

  const fieldElement
    = formElement.querySelector<T>(`${fieldType}[name="${fieldName}"]`)

  if (!fieldElement) {
    return undefined
  }

  return fieldElement
}

export const useFieldElementChange = <
  T
  extends (HTMLInputElement | HTMLSelectElement) = (HTMLInputElement | HTMLSelectElement),
>(
  fieldElement?: T,
  onChange?: (value: string) => void
) => {
  useEffect(() => {
    if (!fieldElement) {
      return
    }

    if (!onChange) {
      return
    }

    const handleChange = (event: ChangeEvent<T>) => {
      if (!onChange) {
        return
      }

      onChange(event.target?.value)
    }

    fieldElement.addEventListener('input', handleChange as unknown as EventListener)

    return () => {
      fieldElement.removeEventListener('input', handleChange as unknown as EventListener)
    }
  }, [fieldElement, onChange])
}

interface UseFieldChangeProps<
  T
  extends (HTMLInputElement | HTMLSelectElement) = (HTMLInputElement | HTMLSelectElement),
> {
  fieldRef: RefObject<T>
  onChange: ChangeEventHandler<T>
}
export const useFieldChange = <
  T
  extends (HTMLInputElement | HTMLSelectElement) = (HTMLInputElement | HTMLSelectElement),
>({
  fieldRef,
  onChange,
}: UseFieldChangeProps<T>) => {
  useEffect(() => {
    const element = fieldRef.current

    if (!element) {
      return
    }

    if (!(typeof onChange !== 'function')) {
      return
    }

    element.addEventListener('input', onChange)

    return () => {
      element.removeEventListener('input', onChange)
    }
  }, [fieldRef, onChange])
}
