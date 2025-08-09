export function fetchFile(filePath: string, mimeType: string = ''): Promise<{
  file: File | undefined
  error: unknown
}> {
  const filename = filePath.replace(/^[^//]*/, ``)

  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(async function onFetchSuccess(response) {
        const blob = await response.blob()
        const file = new File([blob], filename, { type: mimeType })

        resolve({ file, error: undefined })
      })
      .catch(function onFetchError(error) {
        reject({ file: undefined, error })
        // createNotificationWithUniqTags({
        //   entityType: ENTITY_TYPE_NOTIFICATION,
        //   messages: [() => (
        //     <>
        //     { loadJsonDataError }
        //     </>
        //   )],
        //   hideTimeout: STORAGE_EXPORT_NOTIFICATION_TIMEOUT,
        //   tags: ['storage-data-import-demo-data'],
        //   type: 'error',
        //   title: 'Importing demo data failed'
        // })
      })
  })
}
