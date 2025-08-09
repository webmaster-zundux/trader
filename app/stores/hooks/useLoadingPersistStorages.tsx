import { useEffect } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStore } from 'zustand/react'

type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'getInitialState' | 'subscribe'>

export function useLoadingPersistStorages<S extends ReadonlyStoreApi<unknown>>(persistStorages: UseBoundStore<S>[]) {
  const isHydrated = persistStorages
    .map((storage) => {
      // @ts-expect-error - todo improve types
      return storage(state => state.isHydrated)
    })
    .reduce((prev, curr) => prev && curr, true)

  const isLoading = !isHydrated

  useEffect(function initEffect() {
    if (!isHydrated) {
      persistStorages.forEach((persistStorage) => {
        // @ts-expect-error - todo improve types
        const { isHydrating, isHydrated } = persistStorage.getState()

        if (isHydrating || isHydrated) {
          return
        }

        // @ts-expect-error - todo improve types
        persistStorage.getState().isHydrating = true
        // @ts-expect-error - todo improve types
        persistStorage.persist.rehydrate()
      })
    }
  }, [isHydrated, persistStorages])

  return isLoading
}
