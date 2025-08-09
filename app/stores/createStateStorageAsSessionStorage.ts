import superjson from 'superjson'
import type { PersistStorage } from 'zustand/middleware'

export function createStateStorageAsSessionStorage<S>(): PersistStorage<S> {
  return {
    getItem: (name) => {
      const str = window.sessionStorage.getItem(name)

      if (!str) return null
      return superjson.parse(str)
    },
    setItem: (name, value) => {
      window.sessionStorage.setItem(name, superjson.stringify(value))
    },
    removeItem: name => window.sessionStorage.removeItem(name),
  }
}
