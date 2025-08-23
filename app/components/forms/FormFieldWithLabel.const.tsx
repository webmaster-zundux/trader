import { type InputHTMLAttributes } from 'react'
import { type CheckboxGroupFieldItem } from './fields/CheckboxGroupField'
import { type SelectFieldOption } from './fields/SelectField'

export type FormFieldBase<
  T,
  K extends Extract<keyof T, string> = Extract<keyof T, string>
> = {
  label?: string
  name: K
  valueType?: 'integer' | 'float' | 'string'
} & Pick<
  InputHTMLAttributes<HTMLInputElement>, 'required' | 'defaultValue' | 'value'
>

export type FormFieldsRowContainer<
  T,
  K extends Extract<keyof T, string> = Extract<keyof T, string>
> = {
  type: 'row-container'
  label?: string
  labelForFieldName?: K
  // delimiter?: string
  fields: FormField<T>[]
}

export type FormFieldHidden<T> = FormFieldBase<T> & {
  type: 'hidden'
}

export type FormFieldTextInput<T> = FormFieldBase<T> & {
  type?: 'text'
  valueType?: 'string'
  uppercase?: boolean
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'minLength' | 'maxLength' | 'pattern'>

export type FormFieldMultilineTextInput<T> = FormFieldBase<T> & {
  type?: 'multiline-text'
  valueType?: 'string'
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'minLength' | 'maxLength'>

export type FormFieldNumberInput<
  T,
  K extends Extract<keyof T, string> = Extract<keyof T, string>
> = FormFieldBase<T> & {
  type: 'number'
  valueType?: 'integer' | 'float'
  pattern?: string
  step?: string
  min?: number
  max?: number
  value?: number
  formatValue?: (value?: T[K]) => string | undefined
}

export type FormFieldSelect<T> = FormFieldBase<T> & {
  type: 'select'
  valueType?: 'string'
  options: SelectFieldOption[]
  defaultValue?: string
  chooseOptionLabel?: string
  noOptionsLabel?: string
  allowToSelectNoValueOption?: boolean
}

export type FormFieldCheckboxGroup<T> = FormFieldBase<T> & {
  type: 'checkbox-group'
  valueType?: 'string'
  items: CheckboxGroupFieldItem[]
  defaultValue?: string[]
  noItemsLabel?: string
  disabled?: boolean
}

export type FormFieldFileInput<T> = FormFieldBase<T> & {
  type: 'file'
  valueType?: 'string'
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'accept'>

export type FormField<T> =
  | FormFieldHidden<T>
  | FormFieldTextInput<T>
  | FormFieldMultilineTextInput<T>
  | FormFieldNumberInput<T>
  | FormFieldSelect<T>
  | FormFieldCheckboxGroup<T>
  | FormFieldFileInput<T>

export function isFormFieldRowContainer<T>(value: FormField<T> | FormFieldsRowContainer<T>): value is FormFieldsRowContainer<T> {
  return ((value as FormFieldsRowContainer<T>)?.type === 'row-container')
}

export function getFlatFormFields<T>(
  formFields: FormField<T>[] | FormFieldsRowContainer<T>[]
) {
  const flatFormFields = new Array<FormField<T>>()

  for (const formField of formFields) {
    if (isFormFieldRowContainer(formField)) {
      for (const subFormField of formField.fields) {
        flatFormFields.push(subFormField)
      }
    } else {
      flatFormFields.push(formField)
    }
  }

  return flatFormFields
}

export type FormFieldNotHidden<T> = Exclude<FormField<T>, FormFieldHidden<T>>

export function isFormFieldHidden<T>(value: FormField<T>): value is FormFieldHidden<T> {
  return ((value as FormField<T>)?.type === 'hidden')
}

export function isNotFormFieldHidden<T>(value: FormField<T>): value is FormFieldNotHidden<T> {
  return ((value as FormField<T>)?.type !== 'hidden')
}

export function isNotHidden<T>(
  formField: FormField<T>
): formField is FormFieldNotHidden<T> {
  return formField.type !== 'hidden'
}

export function isFormFieldTextInput<T>(value: FormField<T>): value is FormFieldTextInput<T> {
  return ((value as FormField<T>)?.type === 'text') || ((value as FormField<T>)?.type === undefined)
}

export function isFormFieldMultilineTextInput<T>(value: FormField<T>): value is FormFieldMultilineTextInput<T> {
  return ((value as FormField<T>)?.type === 'multiline-text')
}

export function isFormFieldNumberInput<T>(value: FormField<T>): value is FormFieldNumberInput<T> {
  return ((value as FormField<T>)?.type === 'number')
}

export function isFormFieldSelect<T>(value: FormField<T>): value is FormFieldSelect<T> {
  return ((value as FormField<T>)?.type === 'select')
}

export function isFormFieldCheckboxGroup<T>(value: FormField<T>): value is FormFieldCheckboxGroup<T> {
  return ((value as FormField<T>)?.type === 'checkbox-group')
}

export function isFormFieldFileInput<T>(value: FormField<T>): value is FormFieldFileInput<T> {
  return ((value as FormField<T>)?.type === 'file')
}
