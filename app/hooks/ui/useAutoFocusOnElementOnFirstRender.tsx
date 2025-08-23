import type React from 'react'
import { useEffect, useRef, useState } from 'react'

export function useAutoFocusOnElementOnFirstRender<
  E extends HTMLElement = HTMLElement
>({
  autoFocus = false,
  autoFocusDelay = 50,
  retryFocusDelay = 50
}: {
  ref?: React.RefObject<E>
  autoFocus?: boolean
  autoFocusDelay?: number
  retryFocusDelay?: number
}): React.RefObject<E | null> {
  const autoFocusTargetRef = useRef<E>(null)

  const [shouldTryToFocus, setShouldTryToFocus] = useState<number | undefined>(autoFocus ? () => new Date().getTime() : undefined)
  const [elementWasAutoFocused, setElementWasAutoFocused] = useState(false)

  useEffect(function checkVisibilityOfTargetElementEffect() {
    if (
      !autoFocus
      || elementWasAutoFocused
      || shouldTryToFocus === undefined
    ) {
      return
    }

    const autoFocusTargetElement = autoFocusTargetRef.current
    let timeoutId: number

    if (!autoFocusTargetElement) {
      timeoutId = window.setTimeout(function elementVisibilityCheckTimeoutHandler() {
        setShouldTryToFocus(new Date().getTime())
      }, retryFocusDelay)

      return
    }

    const isVisible = autoFocusTargetElement.checkVisibility()

    if (!isVisible) {
      timeoutId = window.setTimeout(function elementVisibilityCheckTimeoutHandler() {
        setShouldTryToFocus(new Date().getTime())
      }, retryFocusDelay)
      return
    }

    timeoutId = window.setTimeout(function focusOnTargetElementTimeoutHandler() {
      autoFocusTargetElement.focus()
      setElementWasAutoFocused(true)
    }, autoFocusDelay)

    return function checkVisibilityOfTargetElementEffectCleanup() {
      window.clearTimeout(timeoutId)
    }
  }, [autoFocus, autoFocusDelay, retryFocusDelay, elementWasAutoFocused, shouldTryToFocus])

  return autoFocusTargetRef
}
