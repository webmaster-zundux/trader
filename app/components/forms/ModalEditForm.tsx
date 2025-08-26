import type React from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import type { Entity } from '../../models/Entity'
import type { Promisefy } from '../../models/utils/utility-types'
import { Button } from '../Button'
import { Modal } from '../modals/Modal'
import { FormFieldList } from './FormFieldList'
import type { FormField } from './FormFieldWithLabel.const'
import styles from './ModalEditForm.module.css'
import { useResetFormFieldsToDefaultValues } from './hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from './hooks/useSubmitForm'

interface ModalEditFormProps<
  T extends Entity = Entity,
> {
  humanizedItemTypeName: string
  itemToEdit?: T
  formFields: FormField<T>[]
  showResetButton?: boolean
  resetButtonLabel?: string
  onCancel: () => void
  saveButtonLabel?: string
  validateFormData?: (item: T) => string | (() => React.JSX.Element) | undefined
  onSubmit: (itemData: T) => Promisefy<string | (() => React.JSX.Element) | undefined | void>
  onDelete?: (item: T) => void
  deleteItemButtonLabel?: string
}
export const ModalEditForm = memo(function ModalEditForm<
  T extends Entity = Entity,
>({
  humanizedItemTypeName,
  itemToEdit,
  formFields,
  showResetButton = false,
  resetButtonLabel,
  onCancel,
  saveButtonLabel,
  validateFormData,
  onSubmit,
  onDelete,
  deleteItemButtonLabel = 'delete item',
}: ModalEditFormProps<T>) {
  const isCreation = !(itemToEdit?.uuid)
  const defaultSaveButtonLabel = `${(isCreation ? `create` : `save`)} ${humanizedItemTypeName || 'item'}`

  const formRef = useRef<HTMLFormElement>(null)

  useResetFormFieldsToDefaultValues(formRef, formFields)

  const {
    handleSubmit,
    formValidationErrorMessage,
  } = useSubmitForm({
    formRef,
    onSubmit,
    formFields,
    validateFormData,
  })

  const handleHide = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleDelete = useCallback(() => {
    if (!(typeof onDelete === 'function')) {
      return
    }

    if (!itemToEdit) {
      return
    }

    onDelete(itemToEdit)
  }, [onDelete, itemToEdit])

  const ModalTitle = useMemo(function titleMemo() {
    const formTitle = `${(isCreation ? `create` : `edit`)} ${humanizedItemTypeName || 'item'}`
    const isShowDeleteButton = (typeof onDelete === 'function') && Boolean(itemToEdit)

    return (
      <div className={styles.TitleWithButton}>
        <span>{formTitle}</span>

        {isShowDeleteButton && (
          <Button
            noPadding
            transparent
            onClick={handleDelete}
            title={deleteItemButtonLabel}
          >
            <i className="icon icon-delete_forever"></i>
          </Button>
        )}
      </div>
    )
  }, [isCreation, humanizedItemTypeName, itemToEdit, onDelete, handleDelete, deleteItemButtonLabel])

  return (
    <Modal
      title={ModalTitle}
      onHide={handleHide}
    >
      <form
        ref={formRef}
        className={styles.ModalEditFormBody}
        onSubmit={handleSubmit}
      >
        <div className={styles.Content}>
          <FormFieldList
            formFields={formFields}
            item={itemToEdit}
          />

          {(formValidationErrorMessage !== undefined) && (
            <div className={styles.ErrorMessageContainer} role="alert">
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
            {showResetButton && (
              <Button type="reset">
                {resetButtonLabel || 'reset form'}
              </Button>
            )}

            <Button type="submit" primary>
              {saveButtonLabel || defaultSaveButtonLabel}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
})
