import { create } from 'zustand'
import type { PersistStorage } from 'zustand/middleware'
import { combine, persist } from 'zustand/middleware'
import type { Entity } from '../../models/Entity'
import type { PartialWithUUID, WithoutUUID } from '../../models/utils/utility-types'
import { isFiniteNumber } from '../../utils/isFiniteNumber'
import { checkIfDemoDataCouldBeLoadedForDataStore } from '../checkIfDemoDataCouldBeLoaded'
import { createStateStorageAsIndexedDB } from '../createStateStorageAsIndexedDB'
import { createStateStorageAsLocalStorage } from '../createStateStorageAsLocalStorage'
import { createStateStorageAsSessionStorage } from '../createStateStorageAsSessionStorage'
import { randomUUID } from '../utils/createRandomUUID'
import { withStorageDOMEvent } from '../withStorageDOMEvent'

const REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS = 0

type State<T extends Entity> = {
  items: T[]
  isHydrated?: boolean
  isHydrating?: boolean
}

function createArrayStoreCoreWithMaxCapacity<T extends Entity>(maxCapacity: number) {
  return combine(
    {
      items: Array<T>(),
    } satisfies State<T>,
    (set, get) => {
      return {
        create: (itemAttributes: WithoutUUID<T>): T => {
          const newItem = {
            ...itemAttributes,
            uuid: randomUUID(),
          } as T

          set((state): Partial<State<T>> => {
            return ({
              items: state.items.slice(-(maxCapacity - 1)).concat(newItem),
            })
          })

          return newItem
        },

        update: (itemAttributes: PartialWithUUID<T>): T | undefined => {
          const originalItems = get().items
          const existingItemIndex = originalItems.findIndex(item => item.uuid === itemAttributes.uuid)

          if (existingItemIndex === -1) {
            return
          }

          const originalItem = originalItems[existingItemIndex]
          const updatedItem: T = {
            ...originalItem,
            ...itemAttributes,
          } as T

          set((state): Partial<State<T>> => {
            return ({
              items: (new Array<T>()).concat(
                state.items.slice(0, existingItemIndex),
                updatedItem,
                state.items.slice(existingItemIndex + 1)
              ),
            })
          })

          return updatedItem
        },

        delete: (itemToDelete: T): void => {
          set((state): Partial<State<T>> => {
            return ({
              items: state.items.filter(item => item.uuid !== itemToDelete.uuid),
            })
          })
        },

        createMultiple: (itemsAttributes: WithoutUUID<T>[]): void => {
          const newItems: T[] = itemsAttributes.map((itemAttributes) => {
            const newItem: T = {
              ...itemAttributes,
              uuid: randomUUID(),
            } as T

            return newItem
          })

          set((state): Partial<State<T>> => {
            return ({
              items: state.items.slice(-(maxCapacity - itemsAttributes.length)).concat(newItems),
            })
          })
        },

        deleteMultiple: (uuidsToDelete: T['uuid'][]): void => {
          set((state): Partial<State<T>> => {
            return ({
              items: state.items.filter(item => !uuidsToDelete.includes(item.uuid)),
            })
          })
        },

        clear: (): void => {
          set((): Partial<State<T>> => {
            return ({
              items: [],
            })
          })
        },

        setIsHydrating(isHydrating: boolean) {
          set((): Partial<State<T>> => {
            return ({
              isHydrating,
            })
          })
        },

        setIsHydrated() {
          set((): Partial<State<T>> => {
            return ({
              isHydrated: true,
              isHydrating: false,
            })
          })
        }
      }
    }
  )
}

function createArrayStoreCore<T extends Entity>() {
  return combine(
    {
      items: Array<T>(),
    } satisfies State<T>,
    (set, get) => {
      return {
        create: (itemAttributes: WithoutUUID<T>): T => {
          const newItem = {
            ...itemAttributes,
            uuid: randomUUID(),
          } as T

          set((state): Partial<State<T>> => {
            return ({
              items: state.items.slice(0).concat(newItem),
            })
          })

          return newItem
        },

        update: (itemAttributes: PartialWithUUID<T>): T | undefined => {
          const originalItems = get().items
          const existingItemIndex = originalItems.findIndex(item => item.uuid === itemAttributes.uuid)

          if (existingItemIndex === -1) {
            return
          }

          const originalItem = originalItems[existingItemIndex]
          const updatedItem: T = {
            ...originalItem,
            ...itemAttributes,
          } as T

          set((state): Partial<State<T>> => {
            return ({
              items: (new Array<T>()).concat(
                state.items.slice(0, existingItemIndex),
                updatedItem,
                state.items.slice(existingItemIndex + 1)
              ),
            })
          })

          return updatedItem
        },

        delete: (itemToDelete: T): void => {
          set((state): Partial<State<T>> => {
            return ({
              items: state.items.filter(item => item.uuid !== itemToDelete.uuid),
            })
          })
        },

        createMultiple: (itemsAttributes: WithoutUUID<T>[]): void => {
          const newItems: T[] = itemsAttributes.map((itemAttributes) => {
            const newItem: T = {
              ...itemAttributes,
              uuid: randomUUID(),
            } as T

            return newItem
          })

          set((state): Partial<State<T>> => {
            return ({
              items: state.items.slice(0).concat(newItems),
            })
          })
        },

        deleteMultiple: (uuidsToDelete: T['uuid'][]): void => {
          set((state): Partial<State<T>> => {
            return ({
              items: state.items.filter(item => !uuidsToDelete.includes(item.uuid)),
            })
          })
        },

        clear: (): void => {
          set((): Partial<State<T>> => {
            return ({
              items: [],
            })
          })
        },

        setIsHydrating(isHydrating: boolean) {
          set((): Partial<State<T>> => {
            return ({
              isHydrating,
            })
          })
        },

        setIsHydrated() {
          set((): Partial<State<T>> => {
            return ({
              isHydrated: true,
              isHydrating: false,
            })
          })
        }
      }
    }
  )
}

export function createEntityArrayStore<T extends Entity>({
  persistStorageItemKey,
  persistStorageType = 'indexedDB',
  maxCapacity,
  isListeningStorageDOMEvent = true,
  skipHydration = true,
}: {
  maxCapacity?: number
  persistStorageType?: 'localStorage' | 'sessionStorage' | 'indexedDB' | undefined
  persistStorageItemKey?: string | undefined
  isListeningStorageDOMEvent?: boolean
  skipHydration?: boolean
} = {}) {
  let storeCore: ReturnType<typeof createArrayStoreCoreWithMaxCapacity<T>> | ReturnType<typeof createArrayStoreCore<T>>

  if (isFiniteNumber(maxCapacity) && maxCapacity > 0) {
    storeCore = createArrayStoreCoreWithMaxCapacity<T>(maxCapacity)
  } else {
    storeCore = createArrayStoreCore<T>()
  }

  if (
    (typeof persistStorageItemKey !== 'string')
    || !persistStorageItemKey
  ) {
    return create(storeCore)
  }

  let storageState: PersistStorage<typeof storeCore>

  if (persistStorageType === 'indexedDB') {
    storageState = createStateStorageAsIndexedDB()
  } else if (persistStorageType === 'sessionStorage') {
    storageState = createStateStorageAsSessionStorage()
  } else {
    storageState = createStateStorageAsLocalStorage()
  }

  const store = create(
    persist(
      storeCore,
      {
        name: persistStorageItemKey,
        storage: storageState,
        skipHydration: !!skipHydration,
        onRehydrateStorage: (state) => {
          return () => {
            window.setTimeout(function rehydrateStorageCompleteTimeoutHandler() {
              state.setIsHydrated()

              window.setTimeout(function onRehydrateStorageCompleteTimeoutHandler() {
                // @ts-expect-error - todo improve types
                checkIfDemoDataCouldBeLoadedForDataStore(store)
              }, REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS)
            }, REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS)
          }
        },
        // @ts-expect-error - todo improve types
        partialize: (state) => {
          const excludeKeyNamesFromPersistedState = ['isHydrated', 'isHydrating']

          return Object.fromEntries(
            Object.entries(state).filter(([key]) => !excludeKeyNamesFromPersistedState.includes(key))
          )
        },
      }
    )
  )

  if (isListeningStorageDOMEvent) {
    // @ts-expect-error - todo improve types
    withStorageDOMEvent(store)
  }

  return store
}
