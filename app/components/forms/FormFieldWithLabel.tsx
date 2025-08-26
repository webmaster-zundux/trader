import { memo } from 'react'
import { CheckboxGroupField } from './fields/CheckboxGroupField'
import { FileField } from './fields/FileField'
import { ImageFileField } from './fields/ImageFileField'
import { InputField } from './fields/InputField'
import type { NumberFieldProps } from './fields/NumberField'
import { NumberField } from './fields/NumberField'
import { SelectField } from './fields/SelectField'
import { TextareaField } from './fields/TextareaField'
import { isFormFieldCheckboxGroup, isFormFieldFileInput, isFormFieldHidden, isFormFieldMultilineTextInput, isFormFieldNumberInput, isFormFieldSelect, isFormFieldTextInput, type FormField } from './FormFieldWithLabel.const'
import { FormFieldWrapper } from './FormFieldWrapper'

interface FormFieldWithLabelProps<T> {
  field: FormField<T>
  fieldValue?: NonNullable<T>[Extract<keyof T, string>] | undefined
  autoFocusOnFirstRender?: boolean
  hideFieldLabel?: boolean
}
export const FormFieldWithLabel = memo(function FormFieldWithLabel<T>({
  field,
  fieldValue,
  autoFocusOnFirstRender = false,
  hideFieldLabel = false,
}: FormFieldWithLabelProps<T>) {
  if (isFormFieldHidden(field)) {
    return (
      <input
        key={field.name}
        type="hidden"
        id={field.name}
        name={field.name}
        required={field.required}
        defaultValue={fieldValue as string ?? field.defaultValue}
      />
    )
  }

  return (
    <FormFieldWrapper
      name={field.name}
      label={field.label ?? field.name}
      type={((field.type === 'file') && (field.accept === 'image/*') && !!(fieldValue as string ?? field.defaultValue)) ? 'hidden' : field.type}
      hideFieldLabel={hideFieldLabel}
      required={field.required}
    >
      {isFormFieldCheckboxGroup(field) && (
        <CheckboxGroupField
          id={field.name}
          name={field.name}
          autoFocusOnFirstRender={autoFocusOnFirstRender}
          required={field.required}
          items={field.items}
          defaultValue={fieldValue as string[] ?? field.defaultValue}
          noItemsLabel={field.noItemsLabel}
        />
      )}
      {isFormFieldSelect(field) && (
        <SelectField
          id={field.name}
          name={field.name}
          autoFocusOnFirstRender={autoFocusOnFirstRender}
          required={field.required}
          options={field.options}
          defaultValue={fieldValue as string ?? field.defaultValue}
          chooseOptionLabel={field.chooseOptionLabel}
          noOptionsLabel={field.noOptionsLabel}
          allowToSelectNoValueOption={field.allowToSelectNoValueOption}
        />
      )}
      {isFormFieldFileInput(field) && (
        <>
          {(field.accept === 'image/*') ? (
            <ImageFileField
              id={field.name}
              name={field.name}
              autoFocusOnFirstRender={autoFocusOnFirstRender}
              required={field.required}
              defaultValue={fieldValue as string ?? field.defaultValue}
              accept={field.accept}
            />
          ) : (
            <FileField
              id={field.name}
              name={field.name}
              autoFocusOnFirstRender={autoFocusOnFirstRender}
              required={field.required}
              accept={field.accept}
            />
          )}
        </>
      )}
      {isFormFieldNumberInput(field) && (
        <NumberField
          id={field.name}
          name={field.name}
          pattern={field.pattern}
          step={field.step}
          autoFocusOnFirstRender={autoFocusOnFirstRender}
          required={field.required}
          defaultValue={fieldValue as string ?? field.defaultValue}
          formatValue={field.formatValue as NumberFieldProps['formatValue']}
          min={field.min}
          max={field.max}
        />
      )}
      {isFormFieldTextInput(field) && (
        <InputField
          id={field.name}
          name={field.name}
          type={field.type}
          autoFocusOnFirstRender={autoFocusOnFirstRender}
          required={field.required}
          defaultValue={fieldValue as string ?? field.defaultValue}
          pattern={field.pattern}
          uppercase={field.uppercase}
        />
      )}
      {isFormFieldMultilineTextInput(field) && (
        <TextareaField
          id={field.name}
          name={field.name}
          autoFocusOnFirstRender={autoFocusOnFirstRender}
          required={field.required}
          defaultValue={fieldValue as string ?? field.defaultValue}
        />
      )}
    </FormFieldWrapper>
  )
})
