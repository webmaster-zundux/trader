import { useCallback, useState } from 'react'

export function useIsVisible(
  isVisibleInitialValue: boolean
) {
  const [isVisible, setIsVisible] = useState(isVisibleInitialValue)

  const handleShow = useCallback(() => {
    setIsVisible(true)
  }, [setIsVisible])

  const handleHide = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const handleToggle = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [setIsVisible])

  return {
    isVisible,
    show: handleShow,
    hide: handleHide,
    toggle: handleToggle,
  }
}
