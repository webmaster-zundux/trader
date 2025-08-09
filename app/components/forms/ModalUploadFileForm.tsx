import { useCallback, useRef } from 'react'
import type { Entity } from '../../models/Entity'
import { Button } from '../Button'
import { Modal } from '../modals/Modal'
import type { FormField } from './FormFieldWithLabel.const'
import { FormFieldList } from './FormFieldList'
import styles from './ModalUploadFileForm.module.css'
import { useResetFormFieldsToDefaultValues } from './hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from './hooks/useSubmitForm'

interface ModalEditFormProps<T extends Entity = Entity> {
  title: string
  informationMessage?: string | (() => React.JSX.Element)
  formFields: FormField<T>[]
  showResetButton?: boolean
  resetButtonLabel?: string
  validateFormData?: ((item: T) => string | (() => React.JSX.Element) | undefined)
  onCancel: () => void
  cancelButtonLabel?: string
  submitButtonLabel?: string
  onSubmit: (itemData: T) => Promise<string | (() => React.JSX.Element) | undefined>
}
export function ModalUploadFileForm<T extends Entity = Entity>({
  title,
  informationMessage,
  formFields,
  showResetButton = false,
  resetButtonLabel,
  validateFormData,
  onCancel,
  cancelButtonLabel,
  submitButtonLabel,
  onSubmit,
}: ModalEditFormProps<T>) {
  const formRef = useRef<HTMLFormElement>(null)

  useResetFormFieldsToDefaultValues(formRef, formFields)

  const { handleSubmit, formValidationErrorMessage } = useSubmitForm({
    formRef,
    onSubmit,
    formFields,
    validateFormData,
  })

  const handleHide = useCallback(() => {
    onCancel()
  }, [onCancel])

  return (
    <Modal title={title} onHide={handleHide}>
      <form
        ref={formRef}
        className={styles.ModalFormBody}
        onSubmit={handleSubmit}
      >
        <div className={styles.Content}>
          {(informationMessage) && (
            <div className={styles.InfoMessageContainer}>
              <div className={styles.InfoMessageText}>
                {
                  (typeof informationMessage === 'function')
                    ? informationMessage()
                    : informationMessage
                }
              </div>
            </div>
          )}

          <FormFieldList formFields={formFields} />

          {(formValidationErrorMessage) && (
            <div className={styles.ErrorMessageContainer} role="alert">
              <div className={styles.ErrorMessageText}>
                {
                  (typeof formValidationErrorMessage === 'function')
                    ? formValidationErrorMessage()
                    : formValidationErrorMessage
                }
              </div>
            </div>
          )}
        </div>

        <div className={styles.ActionButtons}>
          <Button onClick={onCancel}>
            {cancelButtonLabel || 'cancel'}
          </Button>

          <div className={styles.ActionButtonsGroup}>
            {showResetButton && (
              <Button type="reset">
                {resetButtonLabel || 'reset form'}
              </Button>
            )}

            <Button type="submit" primary>
              {submitButtonLabel || 'upload'}
            </Button>
          </div>
        </div>

      </form>
    </Modal>
  )
}
