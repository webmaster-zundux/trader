import { createStore as createIdbStore, del, get, set } from 'idb-keyval'
import superjson from 'superjson'
import type { PersistStorage } from 'zustand/middleware'

export const INDEXED_DB_DATABASE_NAME = 'trader-db-name' // default 'keyval-store'
export const INDEXED_DB_DATABASE_VERSION = Number.parseInt('2', 10) || 1
export const INDEXED_DB_OBJECT_STORE_NAME = 'trader-object-store-name' // default 'keyval'

const customIdbStore = createIdbStore(INDEXED_DB_DATABASE_NAME, INDEXED_DB_OBJECT_STORE_NAME)

export function createStateStorageAsIndexedDB<S>(): PersistStorage<S> {
  return {
    getItem: async (name) => {
      const storedValue = await get(name, customIdbStore)

      if (!storedValue) {
        return null
      }

      return superjson.parse(storedValue)
    },
    setItem: async (name, value) => {
      await set(name, superjson.stringify(value), customIdbStore)
    },
    removeItem: async (name) => {
      await del(name, customIdbStore)
    },
  }
}
