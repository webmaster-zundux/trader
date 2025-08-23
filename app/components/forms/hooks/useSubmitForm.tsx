import type React from 'react'
import type { FormEvent, RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { Promisefy } from '../../../models/utils/utility-types'
import { getFlatFormFields, type FormField, type FormFieldsRowContainer } from '../FormFieldWithLabel.const'

export const getFormData = <T extends object = object>(
  formRef: RefObject<HTMLFormElement | null>
): T | undefined => {
  const form = formRef.current

  if (!form) {
    return undefined
  }

  const dataFromForm: T = Object.fromEntries(
    new FormData(form).entries()
  ) as unknown as T

  return dataFromForm
}

interface UseSubmitFormProps<
  T extends object = object,
  P extends T = T
> {
  formRef: RefObject<HTMLFormElement | null>
  onSubmit: (itemData: T) => Promisefy<string | (() => React.JSX.Element) | undefined | void>
  formFields: FormField<T>[] | FormFieldsRowContainer<T>[]
  validateFormData?: (item: P) => string | (() => React.JSX.Element) | undefined
  showErrorWhenAllVisibleFieldsEmpty?: boolean
}
export const useSubmitForm = <
  T extends object = object,
  P extends T = T
>({
  formRef,
  onSubmit,
  formFields,
  validateFormData,
  showErrorWhenAllVisibleFieldsEmpty = false,
}: UseSubmitFormProps<T, P>) => {
  const [formValidationErrorMessage, setFormErrorMessage] = useState<string | (() => React.JSX.Element)>()

  const handleSubmit = useCallback(async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const formElement = formRef.current

    if (!formElement) {
      return
    }

    const formDataAsObject: P = Object.fromEntries(
      new FormData(formElement).entries()
    ) as unknown as P

    const itemData: P = {} as P

    const flatFormFields = getFlatFormFields(formFields)

    for (const formField of flatFormFields) {
      const { name, type, valueType } = formField

      try {
        if (
          (type === undefined)
          || (type === 'text')
          || (type === 'multiline-text')
          || (type === 'hidden')
          || (type === 'select')
          || (type === 'checkbox-group')
        ) {
          const rawValue: string = formDataAsObject[name as Extract<keyof T, 'string'>] as string

          if (!rawValue) {
            continue
          }

          itemData[name as Extract<keyof T, 'string'>] = (rawValue.trim()) as P[Extract<keyof T, 'string'>]
        } else if (type === 'number') {
          const rawValue: string = formDataAsObject[name as Extract<keyof T, 'string'>] as string

          if (!rawValue) {
            continue
          }

          let value: number

          if (valueType === 'float') {
            value = Number.parseFloat(rawValue)
          } else {
            // case: valueType is 'integer'
            value = Number.parseInt(rawValue)
          }

          if (!Number.isFinite(value)) {
            console.error('Error. Field value type should be a number')
            continue
          }

          itemData[name as Extract<keyof T, 'string'>] = value as P[Extract<keyof T, 'string'>]
        } else if (type === 'file') {
          const rawValue: string = formDataAsObject[name as Extract<keyof T, 'string'>] as string

          if (!rawValue) {
            continue
          }

          const imageFile = (rawValue) as unknown as File

          if ((imageFile instanceof File) && imageFile.size === 0) {
            continue
          }

          itemData[name as Extract<keyof T, 'string'>] = imageFile as P[Extract<keyof T, 'string'>]
        }
      } catch (error) {
        console.error('form field gathering data error', error)
        continue
      }
    }

    if (showErrorWhenAllVisibleFieldsEmpty) {
      const visibleFieldsData: string[] = []

      flatFormFields.forEach(({ name, type }) => {
        if (
          (type !== 'hidden')
          && (itemData[name as Extract<keyof T, 'string'>])
        ) {
          visibleFieldsData.push(name)
        }
      })

      if (!visibleFieldsData.length) {
        setFormErrorMessage(() => (
          <>
            Please fill any field
          </>
        ))
        return
      }
    }

    if (typeof validateFormData === 'function') {
      const errorMessage = validateFormData(itemData)

      setFormErrorMessage(errorMessage)
      if (errorMessage) {
        return
      }
    }

    const errorMessage = await onSubmit(itemData)

    if (errorMessage) {
      setFormErrorMessage(errorMessage)
      return
    }

    formElement.reset()
  }, [formRef, formFields, showErrorWhenAllVisibleFieldsEmpty, validateFormData, onSubmit])

  useEffect(function listenFormResetEventEffect() {
    const form = formRef.current

    if (!form) {
      return
    }

    const handleClearFormErrors = () => {
      setFormErrorMessage(undefined)
    }

    form.addEventListener('reset', handleClearFormErrors)

    return function listenFormResetEventEffectCleanup() {
      form.removeEventListener('reset', handleClearFormErrors)
    }
  }, [formRef])

  return {
    handleSubmit,
    formValidationErrorMessage,
  }
}
