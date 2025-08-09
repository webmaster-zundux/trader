import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import type { StateStorage } from 'zustand/middleware'
import { createJSONStorage, persist } from 'zustand/middleware'

function getUrlSearchString(): string {
  return window.location.search.slice(1)
}

const persistentStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const urlSearchString = getUrlSearchString()

    if (urlSearchString) {
      const searchParams = new URLSearchParams(urlSearchString)
      const storedValue = searchParams.get(key)

      if (!storedValue) {
        return null
      }
      return JSON.parse(storedValue)
    }

    return null
  },
  setItem: (key: string, newValue): void => {
    const urlSearchString = getUrlSearchString()
    const searchParams = new URLSearchParams(urlSearchString)
    const newValueAsString = JSON.stringify(newValue)
    const existingValueByKey = searchParams.get(key)

    if (existingValueByKey) {
      searchParams.set(key, newValueAsString)

      const newUrlSearchString = `?${searchParams.toString()}`

      window.history.replaceState(null, '', newUrlSearchString) // todo - replace by pushState with debounce by time function
      return
    }
    searchParams.set(key, newValueAsString)
    const newUrlSearchString = `?${searchParams.toString()}`

    window.history.pushState(null, '', newUrlSearchString)
  },
  removeItem: (key: string): void => {
    const urlSearchString = getUrlSearchString()
    const searchParams = new URLSearchParams(urlSearchString)

    searchParams.delete(key)

    window.location.search = searchParams.toString()
  },
}

export function createUrlSearchStore<T extends object = object>(
  name: string,
  initializer: StateCreator<T, [['zustand/persist', unknown]], []>
) {
  return create(
    persist<T>(
      initializer,
      {
        name,
        storage: createJSONStorage<T>(() => persistentStorage),
      }
    )
  )
}
