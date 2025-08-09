import { useLayoutEffect, useState } from 'react'

type WindowSize = {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(function addWindowResizeEventListenerLayoutEffect() {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return function addWindowResizeEventListenerLayoutEffectCleanup() {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
