import { create } from 'zustand'
import { combine, persist, type PersistStorage } from 'zustand/middleware'
import type { Entity } from '../../models/Entity'
import type { PartialWithUUID, WithoutUUID } from '../../models/utils/utility-types'
import { isFiniteNumber } from '../../utils/isFiniteNumber'
import { createStateStorageAsIndexedDB } from '../createStateStorageAsIndexedDB'
import { createStateStorageAsLocalStorage } from '../createStateStorageAsLocalStorage'
import { createStateStorageAsSessionStorage } from '../createStateStorageAsSessionStorage'
import { randomUUID } from '../utils/createRandomUUID'
import { getMapKeysAsArray } from '../utils/getMapKeysAsArray'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'
import { withStorageDOMEvent } from '../withStorageDOMEvent'
import { checkIfDemoDataCouldBeLoadedForDataStore } from '../checkIfDemoDataCouldBeLoaded'

const REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS = 0

function nowTimeMarkAsNumber(): number {
  return (new Date()).getTime()
}

type WithTimeMark = {
  createdAt: number
  updatedAt: number
}

function getTheOldestCreated<K, V extends WithTimeMark>(map: Map<K, V>): V | undefined {
  const storedArray = getMapValuesAsArray(map)

  if (!storedArray.length) {
    return undefined
  }

  return storedArray.reduce((previousValue, currentValue) => currentValue.createdAt < previousValue.createdAt ? currentValue : previousValue, storedArray[0])
}

function getManyOldestCreated<K, V extends WithTimeMark>(map: Map<K, V>, quantity: number = 1): V[] {
  const storedArray = getMapValuesAsArray(map)

  if (!storedArray.length) {
    return []
  }

  storedArray.sort((a, b) => a.createdAt - b.createdAt)

  return storedArray.slice(0, quantity)
}

type EntityWithTimeMark<T extends Entity> = T & WithTimeMark

type StateWithTimeMarkedEntities<T extends Entity> = {
  uuids: T['uuid'][]
  entities: Map<T['uuid'], EntityWithTimeMark<T>>
  isHydrated?: boolean
  isHydrating?: boolean
}

function createMapStoreCoreWithMaxCapacity<
  T extends Entity
>(
  maxCapacity: number
) {
  return combine(
    {
      uuids: Array<T['uuid']>(),
      entities: new Map<T['uuid'], EntityWithTimeMark<T>>(),
      isHydrated: false as boolean,
      isHydrating: false as boolean,
    } satisfies StateWithTimeMarkedEntities<T>,
    (set, get) => {
      return {
        // selectors
        items(): T[] {
          return getMapValuesAsArray(get().entities)
        },
        getByUuid(uuid: T['uuid']): T | undefined {
          return get().entities.get(uuid)
        },

        // actions
        create(itemAttributes: WithoutUUID<T>): T {
          const newItem: EntityWithTimeMark<T> = {
            ...itemAttributes,
            uuid: randomUUID(),
            createdAt: nowTimeMarkAsNumber()
          } as EntityWithTimeMark<T>

          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            const newMap = new Map(state.entities)

            newMap.set(newItem.uuid, newItem)

            if (newMap.size >= maxCapacity) {
              const oldest = getTheOldestCreated(newMap)

              if (!oldest) {
                return ({
                  entities: newMap,
                  uuids: getMapKeysAsArray(newMap),
                })
              }

              newMap.delete(oldest.uuid)
            }

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })

          return newItem
        },

        update(itemAttributes: PartialWithUUID<T>): T | undefined {
          const originalEntities = get().entities
          const existingEntity = originalEntities.get(itemAttributes.uuid)

          if (!existingEntity) {
            return
          }

          const originalItem = existingEntity
          const updatedItem: EntityWithTimeMark<T> = {
            ...originalItem,
            ...itemAttributes,
          } as EntityWithTimeMark<T>

          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            const newMap = new Map(state.entities)

            newMap.set(updatedItem.uuid, updatedItem)

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap), // needed to trigger rerender a react component
            })
          })

          return updatedItem
        },

        delete(itemToDelete: T): void {
          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            const newMap = new Map(state.entities)

            newMap.delete(itemToDelete.uuid)

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        createMultiple(itemsAttributes: WithoutUUID<T>[]): void {
          const newItems: EntityWithTimeMark<T>[] = itemsAttributes.map((itemAttributes) => {
            const newItem: EntityWithTimeMark<T> = {
              ...itemAttributes,
              uuid: randomUUID(),
              createdAt: nowTimeMarkAsNumber(),
            } as EntityWithTimeMark<T>

            return newItem
          })

          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            const newMap = new Map(state.entities)

            newItems.forEach((newItem) => {
              newMap.set(newItem.uuid, newItem)
            })

            if (newMap.size >= maxCapacity) {
              const quantityOfItemsToDelete = newMap.size - maxCapacity
              const manyOldest = getManyOldestCreated(newMap, quantityOfItemsToDelete)

              manyOldest.forEach((old) => {
                newMap.delete(old.uuid)
              })
            }

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        deleteMultiple(uuidsToDelete: T['uuid'][]): void {
          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            const newMap = new Map(state.entities)

            uuidsToDelete.forEach((oldUuid) => {
              newMap.delete(oldUuid)
            })

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        clear(): void {
          set((): Partial<StateWithTimeMarkedEntities<T>> => {
            return ({
              entities: new Map<T['uuid'], EntityWithTimeMark<T>>(),
              uuids: new Array<T['uuid']>(),
            })
          })
        },

        refreshUuids(): void {
          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            return ({
              uuids: getMapKeysAsArray(state.entities),
            })
          })
        },

        setIsHydrating(isHydrating: boolean): void {
          set((): Partial<StateWithTimeMarkedEntities<T>> => {
            return ({
              isHydrating,
            })
          })
        },

        setIsHydrated(): void {
          set((state): Partial<StateWithTimeMarkedEntities<T>> => {
            return ({
              isHydrated: true,
              isHydrating: false,
              uuids: getMapKeysAsArray(state.entities),
            })
          })
        }
      }
    }
  )
}

type State<T extends Entity> = {
  uuids: Entity['uuid'][]
  entities: Map<Entity['uuid'], T>
  isHydrated?: boolean
  isHydrating?: boolean
}

function createMapStoreCore<
  T extends Entity
>() {
  return combine(
    {
      uuids: Array<T['uuid']>(),
      entities: new Map<T['uuid'], T>(),
      isHydrated: false as boolean,
      isHydrating: false as boolean,
    } satisfies State<T>,
    (set, get) => {
      return {
        // selectors
        items(): T[] {
          return getMapValuesAsArray(get().entities)
        },
        getByUuid(uuid: T['uuid']): T | undefined {
          return get().entities.get(uuid)
        },

        // actions
        create(itemAttributes: WithoutUUID<T>): T {
          const newItem = {
            ...itemAttributes,
            uuid: randomUUID(),
          } as T

          set((state): Partial<State<T>> => {
            const newMap = new Map(state.entities)

            newMap.set(newItem.uuid, newItem)

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })

          return newItem
        },

        update(itemAttributes: PartialWithUUID<T>): T | undefined {
          const originalEntities = get().entities
          const existingEntity = originalEntities.get(itemAttributes.uuid)

          if (!existingEntity) {
            return
          }

          const originalItem = existingEntity
          const updatedItem: T = {
            ...originalItem,
            ...itemAttributes,
          } as T

          set((state): Partial<State<T>> => {
            const newMap = new Map(state.entities)

            newMap.set(updatedItem.uuid, updatedItem)

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap), // needed to trigger rerender a react component
            })
          })

          return updatedItem
        },

        delete(itemToDelete: T): void {
          set((state): Partial<State<T>> => {
            const newMap = new Map(state.entities)

            newMap.delete(itemToDelete.uuid)

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        createMultiple(itemsAttributes: WithoutUUID<T>[]): void {
          const newItems: T[] = itemsAttributes.map((itemAttributes) => {
            const newItem: T = {
              ...itemAttributes,
              uuid: randomUUID(),
            } as T

            return newItem
          })

          set((state): Partial<State<T>> => {
            const newMap = new Map(state.entities)

            newItems.forEach((newItem) => {
              newMap.set(newItem.uuid, newItem)
            })

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        deleteMultiple(uuidsToDelete: T['uuid'][]): void {
          set((state): Partial<State<T>> => {
            const newMap = new Map(state.entities)

            uuidsToDelete.forEach((oldUuid) => {
              newMap.delete(oldUuid)
            })

            return ({
              entities: newMap,
              uuids: getMapKeysAsArray(newMap),
            })
          })
        },

        clear(): void {
          set((): Partial<State<T>> => {
            return ({
              entities: new Map<T['uuid'], T>(),
              uuids: new Array<T['uuid']>(),
            })
          })
        },

        refreshUuids(): void {
          set((state): Partial<State<T>> => {
            return ({
              uuids: getMapKeysAsArray(state.entities),
            })
          })
        },

        setIsHydrating(isHydrating: boolean): void {
          set((): Partial<State<T>> => {
            return ({
              isHydrating,
            })
          })
        },

        setIsHydrated(): void {
          set((state): Partial<State<T>> => {
            return ({
              isHydrated: true,
              isHydrating: false,
              uuids: getMapKeysAsArray(state.entities),
            })
          })
        }
      }
    }
  )
}

export function createEntityMapStore<T extends Entity>({
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
  let storeCore: ReturnType<typeof createMapStoreCoreWithMaxCapacity<T>> | ReturnType<typeof createMapStoreCore<T>>

  if (isFiniteNumber(maxCapacity) && maxCapacity > 0) {
    storeCore = createMapStoreCoreWithMaxCapacity<T>(maxCapacity)
  } else {
    storeCore = createMapStoreCore<T>()
  }

  if (
    (typeof persistStorageItemKey !== 'string')
    || !persistStorageItemKey
  ) {
    // @ts-expect-error - todo improve types
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
      // @ts-expect-error - todo improve types
      storeCore,
      {
        name: persistStorageItemKey,
        storage: storageState,
        skipHydration: !!skipHydration,
        onRehydrateStorage: (state) => {
          return function onRehydrateStorageCompleted() {
            window.setTimeout(function rehydrateStorageCompleteTimeoutHandler() {
              state.setIsHydrated()

              window.setTimeout(function onRehydrateStorageCompleteTimeoutHandler() {
                checkIfDemoDataCouldBeLoadedForDataStore(store)
              }, REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS)
            }, REHYDRATION_STORAGE_COMPLETE_EVENT_TIMEOUT_MS)
          }
        },
        partialize: (state) => {
          const excludeKeyNamesFromPersistedState = ['isHydrated', 'isHydrating', 'uuids', 'items']

          return Object.fromEntries(
            Object.entries(state).filter(([key]) => !excludeKeyNamesFromPersistedState.includes(key))
          )
        },
      }
    )
  )

  if (
    isListeningStorageDOMEvent
    && (
      persistStorageType === 'sessionStorage'
      || persistStorageType === 'localStorage'
    )) {
    // @ts-expect-error - todo improve types
    withStorageDOMEvent(store)
  }

  return store
}
