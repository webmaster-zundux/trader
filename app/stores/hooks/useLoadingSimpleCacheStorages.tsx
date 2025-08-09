import { useEffect } from 'react'
import type { UseBoundStore } from 'zustand/react'
import type { createSimpleArrayCacheStore } from '../simple-cache-stores/createSimpleArrayCacheStore'
import type { createSimpleMapCacheStore } from '../simple-cache-stores/createSimpleMapCacheStore'

type SimpleMapCacheStore = ReturnType<typeof createSimpleMapCacheStore>
type SimpleArrayCacheStore = ReturnType<typeof createSimpleArrayCacheStore>

export function useLoadingSimpleCacheStorages<S extends (SimpleMapCacheStore | SimpleArrayCacheStore)>(simpleCacheStorages: UseBoundStore<S>[]) {
  const isProcessed = simpleCacheStorages
    .map(storage => storage(state => !!state.lastFilledAt))
    .reduce((prev, curr) => prev && curr, true)

  const isLoading = !isProcessed

  useEffect(function initEffect() {
    if (!isProcessed) {
      simpleCacheStorages.forEach((storage) => {
        const isProcessing = storage.getState().isProcessing
        const lastFilledAt = storage.getState().lastFilledAt

        if (!isProcessing && !lastFilledAt) {
          storage.getState().prepareData()
        }
      })
    }
  }, [isProcessed, simpleCacheStorages])

  return isLoading
}
