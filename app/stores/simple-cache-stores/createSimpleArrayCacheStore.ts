import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type State<T> = {
  lastFilledAt?: number
  isProcessing?: boolean
  items: T[]
}

function createSimpleArrayStore<T>() {
  return combine(
    {
      lastFilledAt: undefined as State<T>['lastFilledAt'],
      isProcessing: false as State<T>['isProcessing'],
      items: Array<T>(),
    } satisfies State<T>,
    set => ({

      prepareData(): void { },

      setIsProcessing(isProcessing?: boolean): void {
        set((): Partial<State<T>> => {
          return ({
            isProcessing,
          })
        })
      },

      replaceAll(newItems: T[]): void {
        set((): Partial<State<T>> => {
          const now = (new Date()).getTime()

          return ({
            items: newItems,
            lastFilledAt: now,
          })
        })
      },

    })
  )
}

export function createSimpleArrayCacheStore<T>() {
  const storeCore = createSimpleArrayStore<T>()

  return create(storeCore)
}
