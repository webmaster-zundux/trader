import { memo, useCallback, useEffect } from 'react'
import { ENTITY_TYPE_NOTIFICATION } from '~/models/notifications/Notifications'
import { loadDemoDataAndReloadPage } from '~/stores/checkIfDemoDataCouldBeLoaded'
import { INDEXED_DB_DATABASE_NAME, INDEXED_DB_DATABASE_VERSION, INDEXED_DB_OBJECT_STORE_NAME } from '~/stores/createStateStorageAsIndexedDB'
import { createNotificationWithUniqTags } from '~/stores/notification-stores/notification.store'
import { clearIndexedDB, getIndexedDBState } from '~/utils/file/import-export-indexedDB-data'
import { downloadStateAsJsonFile } from '~/utils/file/import-export-storage-data'
import { useIsVisible } from '../hooks/ui/useIsVisible'
import { Button } from './Button'
import styles from './ImportExportStorageDataActionButtonGroup.module.css'
import { DescriptionIcon } from './icons/DescriptionIcon'
import { FileDownloadIcon } from './icons/FileDownloadIcon'
import { InkEraserIcon } from './icons/InkEraserIcon'
import { UploadFileIcon } from './icons/UploadFileIcon'
import { ImportStorageDataModal } from './modals/ImportStorageDataModal'
import { ClearStorageConfirmation } from './modals/confirmations/ClearStorageConfirmation'
import { LoadDemoDataConfirmation } from './modals/confirmations/LoadDemoDataConfirmation'
import { ModalNotification } from './modals/notifications/ModalNotification'

const PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_CLEARING_LOCAL_STORAGE_IN_MS = 5 * 1000
const STORAGE_EXPORT_NOTIFICATION_TIMEOUT = 5 * 1000

async function clearDataStorage() {
  const error = await clearIndexedDB(INDEXED_DB_DATABASE_NAME, INDEXED_DB_DATABASE_VERSION, INDEXED_DB_OBJECT_STORE_NAME)

  if (error) {
    createNotificationWithUniqTags({
      entityType: ENTITY_TYPE_NOTIFICATION,
      messages: [() => (
        <>
          {error}
        </>
      )],
      hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
      tags: ['storage-data-cleanup-failure'],
      type: 'error',
      title: 'Data storage cleanup'
    })
    return error
  }

  return undefined
}

export const ImportExportStorageState = memo(function ImportExportStorageState() {
  const {
    isVisible: isVisibleImportStorageDataModal,
    show: showImportStorageDataModal,
    hide: hideImportStorageDataModal,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleClearStorageConfirmation,
    show: showClearStorageConfirmation,
    hide: hideClearStorageConfirmation,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleLoadDemoDataConfirmation,
    show: showLoadDemoDataConfirmation,
    hide: hideLoadDemoDataConfirmation,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleSuccessClearStorageNotification,
    show: showSuccessClearStorageNotification,
  } = useIsVisible(false)

  const handleHideSuccessClearStorageNotification = useCallback(function handleHideSuccessClearStorageNotification() {
    window.location.reload()
  }, [])

  const {
    isVisible: isVisibleSuccessImportStorageDataNotification,
    show: showSuccessImportStorageDataNotification,
  } = useIsVisible(false)

  const handleClearStorageButtonClick = useCallback(async function handleClearStorageButtonClick() {
    const clearingDataError = await clearDataStorage()

    if (clearingDataError) {
      return clearingDataError
    }

    hideClearStorageConfirmation()
    hideImportStorageDataModal()

    showSuccessClearStorageNotification()
  }, [hideClearStorageConfirmation, hideImportStorageDataModal, showSuccessClearStorageNotification])

  const handleExportButtonClick = useCallback(async function handleExportButtonClick() {
    const dateTimeMark = new Date().getTime()
    const { error: getIndexDBStateError, indexDBState } = await getIndexedDBState(INDEXED_DB_DATABASE_NAME, INDEXED_DB_DATABASE_VERSION, INDEXED_DB_OBJECT_STORE_NAME)

    if (getIndexDBStateError) {
      createNotificationWithUniqTags({
        entityType: ENTITY_TYPE_NOTIFICATION,
        messages: [() => (
          <>
            {getIndexDBStateError}
          </>
        )],
        hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
        tags: ['storage-data-export'],
        type: 'error',
        title: 'Export storage data'
      })

      return true
    }

    if (!indexDBState) {
      createNotificationWithUniqTags({
        entityType: ENTITY_TYPE_NOTIFICATION,
        messages: [() => (
          <>
            Nothing to export
          </>
        )],
        hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
        tags: ['storage-data-export'],
        type: 'info',
        title: 'Export storage data'
      })

      return true
    }

    const downloadStateAsJsonFileError = await downloadStateAsJsonFile(indexDBState)

    if (downloadStateAsJsonFileError) {
      return true
    }

    createNotificationWithUniqTags({
      entityType: ENTITY_TYPE_NOTIFICATION,
      messages: [() => (
        <>
          <div>
            Storage data was exported into file.
          </div>
          <div>
            Storage data dump was created at
            {' '}
            {(new Date(dateTimeMark)).toLocaleString()}
          </div>
        </>
      )],
      hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
      tags: ['storage-data-export'],
      type: 'success',
      title: 'Export storage data'
    })

    return undefined
  }, [])

  const handleLoadDemoDataButtonClick = useCallback(async function handleLoadDemoDataButtonClick() {
    const exportDataError = await handleExportButtonClick()

    if (exportDataError) {
      return
    }

    const clearingDataError = await clearDataStorage()

    if (clearingDataError) {
      return
    }

    await loadDemoDataAndReloadPage()
  }, [handleExportButtonClick])

  useEffect(function initPageReloadTimeoutEffect() {
    if (!isVisibleSuccessImportStorageDataNotification) {
      return
    }

    const timerId = window.setTimeout(function pageReloadTimeoutHandler() {
      window.location.reload()
    }, PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_CLEARING_LOCAL_STORAGE_IN_MS)

    return function setupPageReloadTimeoutEffectCleanup() {
      window.clearTimeout(timerId)
    }
  }, [isVisibleSuccessImportStorageDataNotification])

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.ActionButtons}>
          <Button
            size="small"
            noPadding
            transparent
            onClick={showClearStorageConfirmation}
            title="clear storage"
          >
            <InkEraserIcon />
          </Button>

          <Button
            size="small"
            noPadding
            transparent
            onClick={showImportStorageDataModal}
            title="import"
          >
            <UploadFileIcon />
          </Button>

          <Button
            size="small"
            noPadding
            transparent
            onClick={handleExportButtonClick}
            title="export"
          >
            <FileDownloadIcon />
          </Button>

          <Button
            size="small"
            noPadding
            transparent
            onClick={showLoadDemoDataConfirmation}
            title="load demo data"
          >
            <DescriptionIcon />
            <span>
              load demo data
            </span>
          </Button>
        </div>
      </div>

      {isVisibleImportStorageDataModal && (
        <ImportStorageDataModal
          onHide={hideImportStorageDataModal}
          onSuccessImport={showSuccessImportStorageDataNotification}
        />
      )}

      {isVisibleClearStorageConfirmation && (
        <ClearStorageConfirmation
          onHide={hideClearStorageConfirmation}
          onConfirm={handleClearStorageButtonClick}
        />
      )}

      {isVisibleLoadDemoDataConfirmation && (
        <LoadDemoDataConfirmation
          onHide={hideLoadDemoDataConfirmation}
          onConfirm={handleLoadDemoDataButtonClick}
        />
      )}

      {isVisibleSuccessClearStorageNotification && (
        <ModalNotification
          title="storage data was successfully deleted"
          onHide={handleHideSuccessClearStorageNotification}
          okButtonLabel="reload page"
        />
      )}

      {isVisibleSuccessImportStorageDataNotification && (
        <ModalNotification
          title="storage data was successfully imported from file"
        >
          <div style={{ textAlign: 'center', maxHeight: '90%', overflow: 'auto' }}>
            Page will reload automatically in
            {' '}
            {Math.ceil(PAGE_RELOAD_TIMEOUT_AFTER_SUCCESS_CLEARING_LOCAL_STORAGE_IN_MS / 1000)}
            {' '}
            seconds
            <br />
            to use imported storage data
          </div>
        </ModalNotification>
      )}
    </>
  )
})
