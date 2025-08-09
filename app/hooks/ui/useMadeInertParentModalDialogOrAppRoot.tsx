import { useEffect } from 'react'
import type { ModalDialog } from '../../models/modal-dialogs/ModalDialog'
import { getParentModalDialogSelector } from '../../stores/modal-dialog-stores/ModalDialogs.store'
import { getModalDialogParentHtmlElement } from '../../utils/ui/getModalDialogParentHtmlElement'
import { isHtmlElementInert } from '../../utils/ui/isHtmlElementInert'

export function useMadeInertParentModalDialogOrAppRoot(
  elementRef: React.RefObject<HTMLDivElement | null>,
  currentModalDialog?: ModalDialog | undefined
) {
  useEffect(function madeInertElementEffect() {
    const element = elementRef.current

    if (!element) {
      return
    }

    if (!currentModalDialog) {
      return
    }

    const parentModalDialog = getParentModalDialogSelector()
    const parentElement = getModalDialogParentHtmlElement(parentModalDialog)

    if (!parentElement) {
      return
    }

    if (isHtmlElementInert(parentElement)) {
      return
    }

    parentElement.setAttribute('inert', '')

    return function madeInertElementEffectCleanup() {
      parentElement.removeAttribute('inert')
    }
  }, [elementRef, currentModalDialog])
}
