import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'

export function useHtmlElementResize(
  elementRef: RefObject<HTMLElement | null> | null,
  onResizeCallback?: (newWidth: number, newHeight: number) => void
): {
    elementWidth: number
    elementHeight: number
  } {
  const [elementWidth, setElementWidth] = useState(0)
  const [elementHeight, setElementHeight] = useState(0)

  const setElementSize = useCallback(function setElementSize(
    newWidth: number,
    newHeight: number
  ) {
    setElementWidth(newWidth)
    setElementHeight(newHeight)
  }, [setElementWidth, setElementHeight])

  const handleSizeChange = useCallback(function handleSizeChange() {
    const element = elementRef?.current

    if (!element) {
      return
    }

    const newWidth = element.clientWidth
    const newHeight = element.clientHeight

    if (
      !Number.isFinite(newWidth)
      || !Number.isFinite(newHeight)
      || newWidth < 1
      || newHeight < 1
    ) {
      setElementSize(0, 0)
    } else {
      setElementSize(newWidth, newHeight)
    }

    if (typeof onResizeCallback === 'function') {
      onResizeCallback(newWidth, newHeight)
    }
  }, [elementRef, setElementSize, onResizeCallback])

  useEffect(function initElementResizeObserverEffect() {
    const element = elementRef?.current

    if (!element) {
      return
    }

    const resizeObserver = new ResizeObserver(handleSizeChange)

    resizeObserver.observe(element)

    return function initElementResizeObserverEffectCleanup() {
      resizeObserver.unobserve(element)
      resizeObserver.disconnect()
    }
  }, [elementRef, handleSizeChange])

  useEffect(function callElementResizeHandlerOnPageLoadEventEffect() {
    document.addEventListener('load', handleSizeChange)

    return function callElementResizeHandlerOnPageLoadEventEffectCleanup() {
      document.removeEventListener('load', handleSizeChange)
    }
  }, [handleSizeChange])

  return {
    elementWidth,
    elementHeight,
  }
};
