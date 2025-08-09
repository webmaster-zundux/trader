import type { RefObject } from 'react'
import { useEffect } from 'react'
import type { FormField } from '../FormFieldWithLabel.const'

export const useResetFormFieldsToDefaultValues = <T extends object = object>(
  formRef: RefObject<HTMLFormElement | null>,
  formFields: FormField<T>[],
  onReset?: () => void
) => {
  useEffect(function addEventListenerHandleResetFormToDefaultFieldValuesEffect() {
    const form = formRef.current

    if (!form) {
      return
    }

    function handleResetFormToDefaultFieldValues() {
      const form = formRef.current

      if (!form) {
        return
      }

      formFields.forEach(({ name, defaultValue }) => {
        const fieldElement = form.querySelector(`[name="${name}"]`) as unknown as FormField<T>

        if (!fieldElement) {
          return
        }

        fieldElement.value = defaultValue || ''
      })

      if (typeof onReset === 'function') {
        onReset()
      }
    }

    form.addEventListener('reset', handleResetFormToDefaultFieldValues)

    return function addEventListenerHandleResetFormToDefaultFieldValuesEffectCleanup() {
      form.removeEventListener('reset', handleResetFormToDefaultFieldValues)
    }
  }, [formFields, formRef, onReset])
}
