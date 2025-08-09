import { useEffect, type RefObject } from 'react'
import type { ModalDialog } from '~/models/modal-dialogs/ModalDialog'

interface UseFocusOutProps {
  elementRef: RefObject<HTMLElement | null>
  onHide?: () => void
  currentModalDialog?: ModalDialog
}
export function useFocusOut({
  elementRef,
  onHide,
  currentModalDialog,
}: UseFocusOutProps) {
  useEffect(function addFocusOutEventListenerEffect() {
    if (typeof onHide !== 'function') {
      return
    }

    if (!currentModalDialog) {
      return
    }

    function handleFocusOutFromElementOrItsChildren(event: FocusEvent) {
      if (typeof onHide !== 'function') {
        return
      }

      const element = elementRef.current

      if (!!element && element.contains(event.target as (Node | null))) {
        return
      }

      onHide()
    }

    const frameId = window.requestAnimationFrame(() => {
      window.addEventListener('focusin', handleFocusOutFromElementOrItsChildren) // postponed to escape the focusin on a button that opened it
    })

    return function addFocusOutEventListenerEffectCleanup() {
      window.removeEventListener('focusin', handleFocusOutFromElementOrItsChildren)
      window.cancelAnimationFrame(frameId)
    }
  }, [onHide, elementRef, currentModalDialog])
}
