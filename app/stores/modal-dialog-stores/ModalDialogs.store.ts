import type { ModalDialog } from '../../models/modal-dialogs/ModalDialog'
import { createEntityMapStore } from '../entity-stores/createEntityMapStore'

export const useModalDialogsStore = createEntityMapStore<ModalDialog>()

export function getModalDialogsSelector() {
  return useModalDialogsStore.getState().items()
}

export function getTheLatestModalDialogSelector(): ModalDialog | undefined {
  const modalDialogs = getModalDialogsSelector()
  const theLatestModalDialog = modalDialogs[modalDialogs.length - 1]

  if (!theLatestModalDialog) {
    return undefined
  }

  return theLatestModalDialog
}

export function getParentModalDialogSelector(): ModalDialog | undefined {
  const modalDialogs = getModalDialogsSelector()
  const parentModalDialog = modalDialogs[modalDialogs.length - 2]

  if (!parentModalDialog) {
    return undefined
  }

  return parentModalDialog
}
