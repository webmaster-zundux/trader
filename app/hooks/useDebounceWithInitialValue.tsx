import { useEffect, useRef, useState } from 'react'

export function useDebounceWithInitialValue<T>(
  value: T,
  delay: number,
  initialValue: T
) {
  const [debouncedValue, setDebounceValue] = useState(value)
  const initialValueRef = useRef<T>(initialValue)

  useEffect(function applyingValueAfterTimeoutEffect() {
    const prevInitialValue = initialValueRef.current

    if (initialValue !== prevInitialValue) {
      initialValueRef.current = initialValue
      setDebounceValue(initialValue)
      return
    }

    if (value === debouncedValue) {
      return
    }

    const timerId = window.setTimeout(function applyingValueTimeoutHandler() {
      setDebounceValue(value)
    }, delay)

    return function applyingValueAfterTimeoutEffectCleanup() {
      window.clearTimeout(timerId)
    }
  }, [value, delay, debouncedValue, initialValue, initialValueRef])

  return debouncedValue
}
