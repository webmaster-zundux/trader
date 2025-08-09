import { useEffect, useState } from 'react'

export function useDebounceCallback<T>(
  value: T,
  delay: number,
  onSetDebouncedValue: (value: T) => void
) {
  const [debouncedValue, setDebounceValue] = useState(value)

  useEffect(function applyingValueAfterTimeoutEffect() {
    if (value === debouncedValue) {
      return
    }

    const timerId = window.setTimeout(function applyingValueTimeoutHandler() {
      setDebounceValue(value)

      if (typeof onSetDebouncedValue === 'function') {
        onSetDebouncedValue(value)
      }
    }, delay)

    return function applyingValueAfterTimeoutEffectCleanup() {
      window.clearTimeout(timerId)
    }
  }, [value, delay, debouncedValue, onSetDebouncedValue])

  return debouncedValue
}
