import { useEffect, useState } from 'react'
import { ENTITY_TYPE_MODAL_DIALOG, type ModalDialog } from '~/models/modal-dialogs/ModalDialog'
import { useModalDialogsStore } from '~/stores/modal-dialog-stores/ModalDialogs.store'

export function useDialogOrder() {
  const createModalDialog = useModalDialogsStore(state => state.create)
  const deleteModalDialog = useModalDialogsStore(state => state.delete)
  const [currentModalDialog, setCurrentModalDialog] = useState<ModalDialog | undefined>(undefined)

  useEffect(function manageModalDialogExistenceInModalDialogsStackEffect() {
    const createdModalDialog = createModalDialog({
      entityType: ENTITY_TYPE_MODAL_DIALOG,
    })

    setCurrentModalDialog(createdModalDialog)

    return function manageModalDialogExistenceInModalDialogsStackEffectCleanup() {
      setCurrentModalDialog(undefined)
      deleteModalDialog(createdModalDialog)
    }
  }, [setCurrentModalDialog, createModalDialog, deleteModalDialog])

  return currentModalDialog
}
