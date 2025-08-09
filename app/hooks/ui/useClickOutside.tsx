import { useEffect, type RefObject } from 'react'
import type { ModalDialog } from '~/models/modal-dialogs/ModalDialog'

interface UseClickOutsideProps {
  elementRef: RefObject<HTMLElement | null>
  onHide?: () => void
  currentModalDialog?: ModalDialog
}
export function useClickOutside({
  elementRef,
  onHide,
  currentModalDialog,
}: UseClickOutsideProps) {
  useEffect(function addClickOutsideEventListenerEffect() {
    if (typeof onHide !== 'function') {
      return
    }

    if (!currentModalDialog) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
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
      window.addEventListener('click', handleClickOutside) // postponed to escape the click on a button that opened it
    })

    return function addClickOutsideEventListenerEffectCleanup() {
      window.removeEventListener('click', handleClickOutside)
      window.cancelAnimationFrame(frameId)
    }
  }, [onHide, elementRef, currentModalDialog])
}
