async function openConnectionToIndexedDB(
  dbName: string,
  dbVersion: number,
  objectStoreName: string
) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const dbOpenRequest = indexedDB.open(dbName, dbVersion)

    dbOpenRequest.onerror = function onDBOpenRequestEerror(event) {
      const message = 'Error. Opening connection to indexedDB is failed'

      console.error(message, event)
      reject(message)
    }

    dbOpenRequest.onsuccess = function onDBOpenRequestSuccess() {
      const dbConnection = dbOpenRequest.result

      resolve(dbConnection)
    }

    dbOpenRequest.onupgradeneeded = function onDBUpgradeneeded(event: IDBVersionChangeEvent) {
      const db = (event.target as { result: IDBDatabase } | null)?.result

      if (!db) {
        const message = 'Error. Opening connection to indexedDB is failed'

        console.error(message, event)
        reject(message)
        return
      }

      db.onerror = (event) => {
        reject(event)
      }

      try {
        const objectStore = db.createObjectStore(objectStoreName)

        return objectStore
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }
  })
}

async function createTransaction(
  dbName: string,
  dbVersion: number,
  objectStoreName: string,
  type: IDBTransactionMode
) {
  const connection = await openConnectionToIndexedDB(dbName, dbVersion, objectStoreName)
  const transaction = connection.transaction([objectStoreName], type)

  transaction.oncomplete = () => { }

  transaction.onerror = (event) => {
    const message = 'Error. Transaction creation is failed'

    console.error(message, transaction.error, event)
    throw new Error(message)
  }

  return transaction
}

function clearRequest(
  objectStore: IDBObjectStore
) {
  return new Promise<string | never>((resolve, reject) => {
    const objectStoreRequest = objectStore.clear()

    objectStoreRequest.onerror = (event) => {
      const message = 'Error. Object store clearing is failed'

      console.error(message, event)
      reject(message)
    }

    objectStoreRequest.onsuccess = () => {
      const message = 'Success: Object store cleared'

      resolve(message)
    }
  })
}

export async function clearIndexedDB(
  dbName: string,
  dbVersion: number,
  objectStoreName: string
) {
  try {
    const transaction = await createTransaction(dbName, dbVersion, objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)

    await clearRequest(objectStore)
  } catch (error) {
    const message = `Error. Impossible to clear indexedDB`

    if ((error as { name?: string })?.name === 'NotFoundError') {
      return `Error. IndexedDB is empty`
    }

    console.error(message, error)

    return `${message}. ${error}`
  }
}

async function getAllRecordsRequest(
  objectStore: IDBObjectStore
) {
  return new Promise<{ error?: string, result?: { [key: string]: string } } | never>((resolve, reject) => {
    const objectStoreRequest = objectStore.openCursor()
    const storageState: { [key: string]: string } = {}

    objectStoreRequest.onerror = (event) => {
      const message = 'Error. objectStoreRequest failed'

      console.error(message, event)
      reject({ error: message })
    }

    objectStoreRequest.onsuccess = (event) => {
      const cursor = (event.target as ({ result: IDBCursorWithValue } | null))?.result

      if (cursor) {
        const key = cursor.key as string
        const value = cursor.value as string

        storageState[key] = value
        cursor.continue()
      } else {
        resolve({ result: storageState })
      }
    }
  })
}

export async function getIndexedDBState(
  dbName: string,
  dbVersion: number,
  objectStoreName: string
): Promise<{ error?: string, indexDBState?: { [key: string]: string } }> {
  try {
    const transaction = await createTransaction(dbName, dbVersion, objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)
    const { error, result } = await getAllRecordsRequest(objectStore)

    if (error) {
      throw new Error(error)
    }

    return { indexDBState: result }
  } catch (error) {
    const message = `Error. Impossible to read all records from indexedDB`

    if ((error as { name?: string })?.name === 'NotFoundError') {
      return { indexDBState: undefined, error: undefined }
    }

    console.error(message, error)
    return { error: `${message}. ${error}` }
  }
}

async function setRecordRequest(
  objectStore: IDBObjectStore,
  key: string,
  value: string
) {
  return new Promise<string | undefined>((resolve, reject) => {
    const objectStoreRequest = objectStore.put(value, key)

    objectStoreRequest.onerror = (event) => {
      const errorMessage = `Error. objectStoreRequest failed`

      console.error(errorMessage, event)
      reject(errorMessage)
    }

    objectStoreRequest.onsuccess = () => {
      resolve(undefined)
    }
  })
}

export async function setIndexedDBState(
  dbName: string,
  dbVersion: number,
  objectStoreName: string,
  stateToRestore: { [key: string]: string }
): Promise<string | undefined> {
  try {
    const transaction = await createTransaction(dbName, dbVersion, objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)

    Object.entries(stateToRestore).forEach(([key, value]) => {
      setRecordRequest(objectStore, key, value)
    })
  } catch (error) {
    console.error(error)
    return `${error}`
  }
}
