import type React from 'react'
import { useEffect, useRef } from 'react'

export function useAutoFocusOnElementOnFirstRender<
  E extends HTMLElement = HTMLElement
>({
  autoFocus = false,
  autoFocusDelay = 250
}: {
  ref?: React.RefObject<E>
  autoFocus?: boolean
  autoFocusDelay?: number
}): React.RefObject<E | null> {
  const autoFocusTargetRef = useRef<E>(null)

  useEffect(function autoFocusOnTargetElementEffect() {
    if (!autoFocus) {
      return
    }

    const autoFocusTargetElement = autoFocusTargetRef.current

    if (!autoFocusTargetElement) {
      return
    }

    window.setTimeout(function autoFocusTimeoutHandler() {
      autoFocusTargetElement.focus()
    }, autoFocusDelay)
  }, [autoFocusTargetRef, autoFocus, autoFocusDelay])

  return autoFocusTargetRef
}
