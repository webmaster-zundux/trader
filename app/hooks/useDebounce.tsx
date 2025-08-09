import { useEffect, useState } from 'react'

export function useDebounce<T>(
  value: T,
  delay: number
) {
  const [debouncedValue, setDebounceValue] = useState(value)

  useEffect(function applyingValueAfterTimeoutEffect() {
    if (value === debouncedValue) {
      return
    }

    const timerId = window.setTimeout(function applyingValueTimeoutHandler() {
      setDebounceValue(value)
    }, delay)

    return function applyingValueAfterTimeoutEffectCleanup() {
      window.clearTimeout(timerId)
    }
  }, [value, delay, debouncedValue])

  return debouncedValue
}
