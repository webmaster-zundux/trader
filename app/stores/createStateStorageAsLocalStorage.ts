import superjson from 'superjson'
import type { PersistStorage } from 'zustand/middleware'

export function createStateStorageAsLocalStorage<S>(): PersistStorage<S> {
  return {
    getItem: (name) => {
      const str = window.localStorage.getItem(name)

      if (!str) return null
      return superjson.parse(str)
    },
    setItem: (name, value) => {
      window.localStorage.setItem(name, superjson.stringify(value))
    },
    removeItem: name => window.localStorage.removeItem(name),
  }
}
