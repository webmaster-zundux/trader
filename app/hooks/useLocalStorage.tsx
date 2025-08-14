import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'

function getDataType(data: unknown): string {
  if (data === null) {
    return 'null'
  }

  if (typeof data === 'object') {
    return data?.constructor?.name || 'object'
  }

  return typeof data
}

function isLocalStorageHasTheSameTypeAsInitialData(
  storedData: unknown,
  initialValue: unknown,
  storageKey: string
) {
  const areTheyHaveTheSameType = getDataType(storedData) === getDataType(initialValue)

  if (!areTheyHaveTheSameType) {
    console.error(
      `localStorage item '${storageKey}' value has incompatible type (localStorage itemDataType: '${getDataType(storedData)}', initialDataType: '${getDataType(initialValue)})'`
    )
  }

  return areTheyHaveTheSameType
}

function isNextStateHasTheSameTypeAsInitialData(
  nextState: unknown,
  initialValue: unknown,
  storageKey: string
) {
  const areTheyHaveTheSameType = getDataType(nextState) === getDataType(initialValue)

  if (!areTheyHaveTheSameType) {
    console.error(
      `nextState of '${storageKey}' has incompatible value type  (localStorage itemDataType: '${getDataType(nextState)}', initialDataType: '${getDataType(initialValue)})`
    )
  }

  return areTheyHaveTheSameType
}

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

function setLocalStorageItem(key: string, value: unknown): void {
  try {
    const stringifiedValue = JSON.stringify(value)

    window.localStorage?.setItem(key, stringifiedValue)
    dispatchStorageEvent(key, stringifiedValue)
  } catch (error) {
    console.error(error)
    return
  }
}

function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage?.removeItem(key)
    dispatchStorageEvent(key, null)
  } catch (error) {
    console.error(error)
    return
  }
}

function getLocalStorageItem(key: string): string | undefined {
  try {
    return window.localStorage?.getItem(key) || undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}

function getLocalStorageServerSnapshot() {
  return undefined
}

type SetState<S extends object | string | undefined> = S

/**
 *
 * @param storageKey string
 * @param initialValue Object | string | undefined
 * @param isEnsureToUseOnlyTheSameValueType boolean - useful when value is object and it always should has the same object type
 * @returns [ state: StorageState, setState: (value: SetState<StorageState>) => void ]
 */
export function useLocalStorage<StorageState extends object | string | undefined>(
  storageKey: string,
  initialValue: StorageState,
  isEnsureToUseOnlyTheSameValueType: boolean = false
): [
    state: StorageState,
    setState: (value: SetState<StorageState>) => void
] {
  const subsribeOnStorageEventFromLocalStorage = useCallback(function subsribeOnStorageEventFromLocalStorage(callback: (ev: StorageEvent) => void) {
    window.addEventListener('storage', callback)

    return function subsribeOnStorageEventFromLocalStorageCleanup() {
      window.removeEventListener('storage', callback)
    }
  }, [])

  const getSnapshot = useCallback(function getSnapshot() {
    return getLocalStorageItem(storageKey)
  }, [storageKey])

  const store = useSyncExternalStore(
    subsribeOnStorageEventFromLocalStorage,
    getSnapshot,
    getLocalStorageServerSnapshot
  )

  const storeState = useMemo(function storeStateMemo() {
    if (
      (store === null)
      || (store === undefined)
    ) {
      return initialValue
    }

    try {
      const storedData = JSON.parse(store)

      if (isEnsureToUseOnlyTheSameValueType) {
        if (!isLocalStorageHasTheSameTypeAsInitialData(storedData, initialValue, storageKey)) {
          return initialValue
        }
      }

      return storedData
    } catch (error) {
      console.error(error)
      return initialValue
    }
  }, [initialValue, storageKey, store, isEnsureToUseOnlyTheSameValueType])

  const setState = useCallback(function setState(value: SetState<StorageState>): void {
    const nextState = value

    if (isEnsureToUseOnlyTheSameValueType) {
      if (!isNextStateHasTheSameTypeAsInitialData(nextState, initialValue, storageKey)) {
        return
      }
    }

    if (
      (nextState === undefined)
      || (nextState === null)
    ) {
      removeLocalStorageItem(storageKey)
    } else {
      setLocalStorageItem(storageKey, nextState)
    }
  }, [initialValue, storageKey, isEnsureToUseOnlyTheSameValueType])

  useEffect(function saveNewValueToLocalStorageEffect() {
    const storedValue = getLocalStorageItem(storageKey)

    if (
      (
        (storedValue === null)
        || (storedValue === undefined)
      )
      && (initialValue !== undefined)
    ) {
      setLocalStorageItem(storageKey, initialValue)
    }
  }, [storageKey, initialValue])

  return [storeState, setState]
}
