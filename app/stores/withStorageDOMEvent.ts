import type { Mutate, StoreApi } from 'zustand'

type StoreWithPersist<S extends object> = Mutate<StoreApi<S>, [['zustand/persist', unknown]]>

export const withStorageDOMEvent = <S extends object>(store: StoreWithPersist<S>) => {
  if (typeof window === 'undefined') {
    return store
  }

  const onStorageEvent = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate()
    }
  }

  window.addEventListener('storage', onStorageEvent)

  return () => {
    window.removeEventListener('storage', onStorageEvent)
  }
}
