import { useEffect } from 'react'
import type { ModalDialog } from '../../models/modal-dialogs/ModalDialog'
import { getTheLatestModalDialogSelector } from '../../stores/modal-dialog-stores/ModalDialogs.store'
import { KEYBOARD_KEY_ESCAPE } from './keyboardKeys.const'

interface UseCloseOnEscProps {
  onClose?: () => void
  currentModalDialog?: ModalDialog
}
export function useCloseOnEsc({
  onClose,
  currentModalDialog,
}: UseCloseOnEscProps) {
  useEffect(function addEscKeyDownEventListenerEffect() {
    if (typeof onClose !== 'function') {
      return
    }

    if (!currentModalDialog) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (typeof onClose !== 'function') {
        return
      }

      if (event.key === KEYBOARD_KEY_ESCAPE) {
        const latestModalDialog = getTheLatestModalDialogSelector()

        if (!Object.is(currentModalDialog, latestModalDialog)) {
          return
        }

        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return function addEscKeyDownEventListenerEffectCleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, currentModalDialog])
}
