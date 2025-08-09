import { memo, useCallback, useRef } from 'react'
import type { EntityBaseFilter } from '~/models/entities-filters/EntityBaseFilter'
import type { Promisefy } from '../../models/utils/utility-types'
import { Button } from '../Button'
import { FormFieldList } from '../forms/FormFieldList'
import type { FormField } from '../forms/FormFieldWithLabel.const'
import { useResetFormFieldsToDefaultValues } from '../forms/hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from '../forms/hooks/useSubmitForm'
import { Dialog } from './Dialog'
import styles from './DialogFilterForm.module.css'

interface DialogEditFormProps<T extends EntityBaseFilter = EntityBaseFilter> {
  humanizedPluralItemTypeName: string

  filterValue?: T

  formFields: FormField<T>[]

  showResetButton?: boolean
  resetButtonLabel?: string

  onCancel: () => void
  cancelButtonLabel?: string
  showCancelButton?: boolean

  validateFormData?: (item: T) => string | (() => React.JSX.Element) | undefined
  onFilter: (itemData: T) => void
  filterButtonLabel?: string

  onSaveFilterParamsAs?: (itemData: T) => Promisefy<string | (() => React.JSX.Element) | undefined>
  saveFilterParamsAsButtonLabel?: string
}
export const DialogFilterForm = memo(function DialogFilterForm<
  T extends EntityBaseFilter = EntityBaseFilter,
>({
  humanizedPluralItemTypeName: humanizedItemTypeName,
  filterValue,
  formFields,
  onCancel,
  cancelButtonLabel = 'cancel',
  showCancelButton = false,
  validateFormData,
  onFilter,
  filterButtonLabel = 'apply filter',
}: DialogEditFormProps<T>) {
  const title = `filter ${humanizedItemTypeName || 'items'}`
  const formRef = useRef<HTMLFormElement>(null)

  const {
    handleSubmit,
    formValidationErrorMessage,
  } = useSubmitForm({
    formRef,
    onSubmit: onFilter,
    formFields,
    validateFormData,
    showErrorWhenAllVisibleFieldsEmpty: false,
  })

  const handleHide = useCallback(function handleHide() {
    onCancel()
  }, [onCancel])

  const handleReset = useCallback(function handleReset() {
    handleSubmit()
  }, [handleSubmit])

  useResetFormFieldsToDefaultValues(formRef, formFields, handleReset)

  const resetButtonLabel = 'reset filter'

  return (
    <>
      <Dialog
        title={title}
        onHide={handleHide}
      >
        <form
          ref={formRef}
          className={styles.DialogEditFormBody}
          onSubmit={handleSubmit}
        >
          <div className={styles.Content}>
            <FormFieldList
              formFields={formFields}
              item={filterValue}
            />
            {(formValidationErrorMessage !== undefined) && (
              <div className={styles.ErrorMessageContainer}>
                <span className={styles.ErrorMessageText}>
                  {
                    (typeof formValidationErrorMessage === 'function')
                      ? formValidationErrorMessage()
                      : formValidationErrorMessage
                  }
                </span>
              </div>
            )}
          </div>

          <div className={styles.ActionButtons}>
            <div className={styles.ActionButtonsGroup}>
              {showCancelButton && (
                <Button onClick={onCancel}>
                  {cancelButtonLabel}
                </Button>
              )}

            </div>
            <div className={styles.ActionButtonsGroup}>
              <Button type="reset">
                {resetButtonLabel}
              </Button>

              <Button type="submit" primary>
                {filterButtonLabel}
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
})
