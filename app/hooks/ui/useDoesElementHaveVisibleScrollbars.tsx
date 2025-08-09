import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import type { Entity } from '../../models/Entity'
import { useWindowSize } from './useWindowSize'

type VisibleScrollbarPlaces = {
  vertical: boolean
  horizontal: boolean
}

export function useDoesElementHaveVisibleScrollbars<
  T extends Entity = Entity,
>(
  elementRef: RefObject<HTMLElement | null>,
  items: T[]
): VisibleScrollbarPlaces {
  const [places, setPlaces] = useState<VisibleScrollbarPlaces>({
    vertical: false,
    horizontal: false,
  })

  const isScrollbarVisible = useCallback(function isScrollbarVisible() {
    const element = elementRef.current

    if (!element) {
      setPlaces({
        vertical: false,
        horizontal: false,
      })
      return
    }

    const overflowY = window.getComputedStyle(element).overflowY
    const overflowX = window.getComputedStyle(element).overflowX

    setPlaces({
      horizontal: (overflowX === 'scroll' || overflowX === 'auto') && element.scrollWidth > element.clientWidth,
      vertical: (overflowY === 'scroll' || overflowY === 'auto') && element.scrollHeight > element.clientHeight,
    })
  }, [elementRef])

  useLayoutEffect(function initialLayoutEffect() {
    isScrollbarVisible()
  }, [isScrollbarVisible])

  const windowSize = useWindowSize()

  useEffect(function onChangeWindowSizeOrItemsEffect() {
    isScrollbarVisible()
  }, [windowSize, items, isScrollbarVisible])

  return places
}
