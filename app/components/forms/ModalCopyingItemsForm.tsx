import type React from 'react'
import { useCallback, useMemo, useRef } from 'react'
import type { Entity } from '../../models/Entity'
import type { Promisefy } from '../../models/utils/utility-types'
import { Button } from '../Button'
import { Modal } from '../modals/Modal'
import { FormFieldList } from './FormFieldList'
import type { FormField } from './FormFieldWithLabel.const'
import styles from './ModalCopyingItemsForm.module.css'
import { useResetFormFieldsToDefaultValues } from './hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from './hooks/useSubmitForm'

type EntityWithUuids = Entity & {
  uuids: Entity['uuid'][]
}

function getFormFields<T extends Entity = Entity>(
  items: T[] | undefined
): FormField<EntityWithUuids>[] {
  if (!items?.length) {
    return [
      {
        type: 'checkbox-group',
        name: 'uuids',
        label: 'selected items',
        defaultValue: [],
        items: [],
        disabled: true,
      },
    ]
  }

  const fieldItems = items.map(({ uuid }) => {
    return {
      value: uuid,
      label: 'unknown label',
    }
  })

  const allItemsUuidsAsSelectedByDefault = fieldItems.map(({ value }) => value)

  return [
    {
      type: 'checkbox-group',
      name: 'uuids',
      label: 'selected items',
      defaultValue: allItemsUuidsAsSelectedByDefault,
      items: fieldItems,
    },
  ]
}

interface ModalCopyingItemsFormProps<
  T extends Entity = Entity,
> {
  title?: string
  itemsToCreate: T[] | undefined
  showResetButton?: boolean
  resetButtonLabel?: string
  onCancel: () => void
  cancelButtonLabel?: string
  saveButtonLabel?: string
  onBulkCreate: (approvedItems: T[]) => Promisefy<string | (() => React.JSX.Element) | undefined | void>
}
export function ModalCopyingItemsForm<
  T extends Entity = Entity,
>({
  title = 'copy selected items',
  itemsToCreate,
  showResetButton = false,
  resetButtonLabel,
  onCancel,
  cancelButtonLabel,
  saveButtonLabel,
  onBulkCreate,
}: ModalCopyingItemsFormProps<T>) {
  const defaultSaveButtonLabel = 'copy items'

  const formRef = useRef<HTMLFormElement>(null)

  const formFields = useMemo(() => {
    return getFormFields(itemsToCreate)
  }, [itemsToCreate])

  useResetFormFieldsToDefaultValues(formRef, formFields)

  const handleBulkCreate = useCallback((itemData: EntityWithUuids) => {
    if (!itemsToCreate?.length) {
      return
    }

    const approvedItems = itemsToCreate.filter(itemToCreate => itemData.uuids.includes(itemToCreate.uuid))

    onBulkCreate(approvedItems)
  }, [itemsToCreate, onBulkCreate])

  const validateFormData = useCallback((): string | (() => React.JSX.Element) | undefined => {
    return undefined
  }, [])

  const {
    handleSubmit,
    formValidationErrorMessage,
  } = useSubmitForm({
    formRef,
    onSubmit: handleBulkCreate,
    formFields,
    validateFormData,
  })

  const handleHide = useCallback(() => {
    onCancel()
  }, [onCancel])

  const itemToEdit = useMemo(() => {
    if (!itemsToCreate) {
      return undefined
    }

    return {
      uuids: itemsToCreate.map(item => item.uuid),
      entityType: 'approved-items',
      uuid: 'no-uuid',
    } satisfies EntityWithUuids
  }, [itemsToCreate])

  return (
    <Modal title={title} onHide={handleHide}>
      <form
        ref={formRef}
        className={styles.ModalCopyingItemsFormBody}
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
          <Button onClick={onCancel}>
            {cancelButtonLabel || 'cancel'}
          </Button>

          <div className={styles.ActionButtonsGroup}>
            {showResetButton && (
              <Button size="small">
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
}
