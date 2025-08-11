import { ENTITY_TYPE_NOTIFICATION } from '~/models/notifications/Notifications'
import { importDataFromJsonString } from '~/stores/importDataFromJsonString'
import { fetchFile } from '~/utils/file/fetchFile'
import { readFileAsJsonString } from '~/utils/file/import-export-storage-data'
import { useBuyOrdersStore } from './entity-stores/BuyOrders.store'
import type { createEntityArrayStore } from './entity-stores/createEntityArrayStore'
import type { createEntityMapStore } from './entity-stores/createEntityMapStore'
import { useLocationsStore } from './entity-stores/Locations.store'
import { useLocationTypesStore } from './entity-stores/LocationTypes.store'
import { useMovingEntitiesStore } from './entity-stores/MovingEntities.store'
import { useMovingEntityClassesStore } from './entity-stores/MovingEntityClasses.store'
import { usePlanetarySystemsStore } from './entity-stores/PlanetarySystems.store'
import { usePriceHistoriesStore } from './entity-stores/PriceHistories.store'
import { useProductRaritiesStore } from './entity-stores/ProductRarities.store'
import { useProductsStore } from './entity-stores/Products.store'
import { useProductTypesStore } from './entity-stores/ProductTypes.store'
import { useSellOrdersStore } from './entity-stores/SellOrders.store'
import { createNotificationWithUniqTags } from './notification-stores/notification.store'

export const USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA = true // todo move into environmental variables

const DEMO_DATA_JSON_FILE_PATH = `${import.meta.env.BASE_URL}demo-data.json.gz`
const PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_LOADING_DEMO_DATA_INTO_STORAGE_IN_MS = 2 * 1000
const STORAGE_EXPORT_NOTIFICATION_TIMEOUT = PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_LOADING_DEMO_DATA_INTO_STORAGE_IN_MS

type Store = ReturnType<typeof createEntityMapStore> | ReturnType<typeof createEntityArrayStore>

const checkedStoresWithoutDataRequiredForDemo = new Map<Store, boolean>()

export const storagesRequiredForDemo = [
  useSellOrdersStore,
  useBuyOrdersStore,
  usePriceHistoriesStore,

  useProductsStore,
  useProductTypesStore,
  useProductRaritiesStore,

  useLocationsStore,
  useLocationTypesStore,

  usePlanetarySystemsStore,

  useMovingEntitiesStore,
  useMovingEntityClassesStore,
]
const storagesNamesRequiredForDemo = [
  'useSellOrdersStore',
  'useBuyOrdersStore',
  'usePriceHistoriesStore',

  'useProductsStore',
  'useProductTypesStore',
  'useProductRaritiesStore',

  'useLocationsStore',
  'useLocationTypesStore',

  'usePlanetarySystemsStore',

  'useMovingEntitiesStore',
  'useMovingEntityClassesStore',
]

storagesRequiredForDemo.map((store) => {
  checkedStoresWithoutDataRequiredForDemo.set(store, false)
})

const namesOfStoragesRequiredForDemo = new Map<Store, string>()

storagesRequiredForDemo.map((store, index) => {
  namesOfStoragesRequiredForDemo.set(store, storagesNamesRequiredForDemo[index])
})

let canLoadDemoData = true

export function checkIfDemoDataCouldBeLoadedForAllRequiredDataStores() {
  if (!canLoadDemoData) {
    return
  }

  const checkedStoresWithoutData = new Array<string>()

  checkedStoresWithoutDataRequiredForDemo.forEach((isChecked, store) => {
    if (isChecked) {
      const storeName = namesOfStoragesRequiredForDemo.get(store)

      if (!storeName) {
        console.error('')
        return
      }

      checkedStoresWithoutData.push(storeName)
    }
  })

  if (checkedStoresWithoutData.length === checkedStoresWithoutDataRequiredForDemo.size) {
    loadDemoDataAndReloadPage()
  }
}

export function checkIfDemoDataCouldBeLoadedForDataStore(store: Store) {
  if (!USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA) {
    return
  }

  if (!canLoadDemoData) {
    return
  }

  if (
    checkedStoresWithoutDataRequiredForDemo.has(store)
    && !(checkedStoresWithoutDataRequiredForDemo.get(store))
  ) {
    // @ts-expect-error isHydrated does not exist in state<T> - todo improve types
    const isStoreHydrated = store.getState().isHydrated as boolean
    const stateItems = store.getState().items
    const items = (typeof stateItems === 'function') ? stateItems() : stateItems
    const hasItems = !!items.length
    const hasData = isStoreHydrated && hasItems

    checkedStoresWithoutDataRequiredForDemo.set(store, hasData)
    if (hasData) {
      canLoadDemoData = false
      checkedStoresWithoutDataRequiredForDemo.clear()
    } else {
      checkedStoresWithoutDataRequiredForDemo.set(store, true)
      checkIfDemoDataCouldBeLoadedForAllRequiredDataStores()
    }
  }
}

async function loadDemoDataAsString(filename: string, mimetype: string) {
  const { file: storageDataJsonFile, error: loadJsonDataError } = await fetchFile(filename, mimetype)

  if (!storageDataJsonFile) {
    createNotificationWithUniqTags({
      entityType: ENTITY_TYPE_NOTIFICATION,
      messages: [() => (
        <>
          {loadJsonDataError}
        </>
      )],
      hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
      tags: ['storage-data-import-demo-data'],
      type: 'error',
      title: 'Loading demo data failed'
    })
    return
  }

  return await readFileAsJsonString(storageDataJsonFile)
}

export async function loadDemoDataAndReloadPage() {
  let storageStateAsJsonString = await loadDemoDataAsString(DEMO_DATA_JSON_FILE_PATH, 'application/json')

  if (!storageStateAsJsonString) {
    // case: when a browser does not automatically decode gzip files when the file loads by window.fetch()
    storageStateAsJsonString = await loadDemoDataAsString(DEMO_DATA_JSON_FILE_PATH, 'application/gzip')
  }

  if (!storageStateAsJsonString) {
    const errorMessage = `Data should be in json format`

    createNotificationWithUniqTags({
      entityType: ENTITY_TYPE_NOTIFICATION,
      messages: [() => (
        <>
          {errorMessage}
        </>
      )],
      hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
      tags: ['storage-data-import-demo-data'],
      type: 'error',
      title: 'Importing demo data failed',
    })
    return
  }

  const importError = await importDataFromJsonString(storageStateAsJsonString)

  if (importError) {
    createNotificationWithUniqTags({
      entityType: ENTITY_TYPE_NOTIFICATION,
      messages: [() => (
        <>
          {importError}
        </>
      )],
      hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
      tags: ['storage-data-import-demo-data'],
      type: 'error',
      title: 'Importing demo data failed',
    })
    return
  }

  createNotificationWithUniqTags({
    entityType: ENTITY_TYPE_NOTIFICATION,
    messages: [() => (
      <>
        <div>
          Demo data successfully loaded.
        </div>
        <div>
          Page will be reloaded in
          {' '}
          {Math.ceil(PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_LOADING_DEMO_DATA_INTO_STORAGE_IN_MS / 1000)}
          {' '}
          seconds to use demo data
        </div>
      </>
    )],
    hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
    tags: ['storage-data-import-demo-data'],
    type: 'success',
    title: 'Importing demo data'
  })

  window.setTimeout(function pageReloadAfterTimeoutHandler() {
    window.location.reload()
  }, PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_LOADING_DEMO_DATA_INTO_STORAGE_IN_MS)

  return
}
