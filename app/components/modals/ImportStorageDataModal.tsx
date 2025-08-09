import { useCallback } from 'react'
import { COMPRESSED_DUMP_FILE_EXTENSION, DUMP_FILE_EXTENSION, STORAGE_STATE_ACCEPTABLE_FILE_EXTENSIONS, STORAGE_STATE_ACCEPTABLE_FILE_TYPES_AS_STRING, doesFileHaveAcceptableFileExtension, readFileAsJsonString } from '~/utils/file/import-export-storage-data'
import type { Entity } from '../../models/Entity'
import { importDataFromJsonFile } from '../../stores/importDataFromJsonFile'
import type { FormField } from '../forms/FormFieldWithLabel.const'
import { ModalUploadFileForm } from '../forms/ModalUploadFileForm'

type StorageState = Entity & {
  storageDataJsonFile: File
}

const formFields: FormField<StorageState>[] = [
  {
    name: 'storageDataJsonFile',
    type: 'file',
    required: true,
    label: 'file',
    accept: STORAGE_STATE_ACCEPTABLE_FILE_TYPES_AS_STRING,
  },
]

interface ImportStorageDataModalProps {
  onHide?: () => void
  onSuccessImport?: () => void
}
export const ImportStorageDataModal = ({
  onHide,
  onSuccessImport,
}: ImportStorageDataModalProps) => {
  const handleHideModal = useCallback(() => {
    if (typeof onHide !== 'function') {
      return
    }

    onHide()
  }, [onHide])

  const handleSubmit = useCallback(async ({ storageDataJsonFile }: StorageState) => {
    const storageStateAsJsonString = await readFileAsJsonString(storageDataJsonFile)
    const importError = await importDataFromJsonFile(storageStateAsJsonString)

    if (importError) {
      return importError
    }

    handleHideModal()

    if (typeof onSuccessImport !== 'function') {
      return
    }
    onSuccessImport()
  }, [handleHideModal, onSuccessImport])

  const validateFormData = useCallback(({ storageDataJsonFile }: StorageState): string | (() => React.JSX.Element) | undefined => {
    const fileHasAcceptableFileExtension = doesFileHaveAcceptableFileExtension(storageDataJsonFile, STORAGE_STATE_ACCEPTABLE_FILE_EXTENSIONS)

    if (!fileHasAcceptableFileExtension) {
      return function ErrorMessage() {
        return (
          <>
            File should has
            {' '}
            <strong>
              .
              {DUMP_FILE_EXTENSION}
            </strong>
            {' '}
            or
            {' '}
            <strong>
              .
              {COMPRESSED_DUMP_FILE_EXTENSION}
            </strong>
            {' '}
            file extension
          </>
        )
      }
    }
  }, [])

  const renderInfoMessage = useCallback(() => {
    return (
      <>
        Warning.
        <br />
        Importing data will replace
        {' '}
        <strong>all existing data</strong>
        {' '}
        in the storage (indexedBD)
      </>
    )
  }, [])

  return (
    <ModalUploadFileForm
      title="Importing storage data"
      informationMessage={renderInfoMessage}
      formFields={formFields}
      validateFormData={validateFormData}
      onCancel={handleHideModal}
      onSubmit={handleSubmit}
      submitButtonLabel="import"
    />
  )
}
