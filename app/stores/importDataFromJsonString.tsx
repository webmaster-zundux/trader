import { INDEXED_DB_DATABASE_NAME, INDEXED_DB_OBJECT_STORE_NAME } from '~/stores/createStateStorageAsIndexedDB'
import { setIndexedDBState } from '~/utils/file/import-export-indexedDB-data'
import { deserializeStateFromJSONString } from '~/utils/file/import-export-storage-data'

export async function importDataFromJsonString(storageStateAsJsonString: string): Promise<string | undefined> {
  try {
    const storageData = deserializeStateFromJSONString(storageStateAsJsonString)

    if (!storageData) {
      return 'Upload file error. Impossible to read json data from the file'
    }

    const setDataError = await setIndexedDBState(INDEXED_DB_DATABASE_NAME, INDEXED_DB_OBJECT_STORE_NAME, storageData)

    if (setDataError) {
      return 'Upload file error. Impossible set data into indexedBD'
    }
  } catch (error) {
    console.error(error)
    return `Upload file error. ${error}`
  }

  return undefined
}
