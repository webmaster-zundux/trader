import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { getMapValuesAsArray } from '../utils/getMapValuesAsArray'

type State<K, T> = {
  lastFilledAt?: number
  isProcessing?: boolean
  itemsMap: Map<K, T>
}

function createSimpleMapStore<K, T>() {
  return combine(
    {
      lastFilledAt: undefined as State<K, T>['lastFilledAt'],
      isProcessing: false as State<K, T>['isProcessing'],
      itemsMap: new Map() as State<K, T>['itemsMap'],
    } satisfies State<K, T>,
    (set, get) => ({
      // selectors
      items(): T[] {
        return getMapValuesAsArray(get().itemsMap)
      },

      prepareData(): void { },

      setIsProcessing(isProcessing?: boolean): void {
        set((): Partial<State<K, T>> => {
          return ({
            isProcessing,
          })
        })
      },

      replaceAll(itemsMap: Map<K, T>): void {
        set((): Partial<State<K, T>> => {
          const now = (new Date()).getTime()

          return ({
            itemsMap,
            lastFilledAt: now,
          })
        })
      },

    })
  )
}

export function createSimpleMapCacheStore<K, T>() {
  const storeCore = createSimpleMapStore<K, T>()

  return create(storeCore)
}
