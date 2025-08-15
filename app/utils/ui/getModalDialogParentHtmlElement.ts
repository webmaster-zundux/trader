import { APP_ROOT_ELEMENT_ID } from '~/App.const'
import type { ModalDialog } from '../../models/modal-dialogs/ModalDialog'
import { createModalDialogElementId } from './createModalDialogElementId'

export function getModalDialogParentHtmlElement(
  parentModalDialog?: ModalDialog
): HTMLElement | undefined {
  let parentElement: HTMLElement | undefined = undefined

  if (parentModalDialog?.uuid) {
    const parentModalDialogElementId = createModalDialogElementId(parentModalDialog.uuid)

    parentElement = document.getElementById(parentModalDialogElementId) as HTMLDivElement
  }

  if (!parentElement) {
    parentElement = document.getElementById(APP_ROOT_ELEMENT_ID) as HTMLDivElement
    if (!parentElement) {
      return undefined
    }
  }

  return parentElement
}
