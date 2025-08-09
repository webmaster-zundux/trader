import superjson from 'superjson'

export const DUMP_COMPRESSION_FORMAT = 'gzip' as const

export const DUMP_FILENAME_PREFIX = 'trader_' as const
export const DUMP_FILE_EXTENSION = 'json' as const
export const GZIP_FILE_EXTENSION = 'gz' as const
const GZIP_FILE_MIME_TYPE = 'application/octet-stream' as const

export const COMPRESSED_DUMP_FILE_EXTENSION = `${DUMP_FILE_EXTENSION}.${GZIP_FILE_EXTENSION}` as const

export type StorageDataJsonOject = { [key: string]: string }

export function getFileExtension(
  file: File
): string | undefined {
  const filenameParts = file.name.split('.')

  let fileExtension = filenameParts.pop()

  if (fileExtension === GZIP_FILE_EXTENSION) {
    const dataFormat = filenameParts.pop()

    fileExtension = [dataFormat, fileExtension].join('.')
  }

  return fileExtension
}

export function doesFileHaveAcceptableFileExtension(
  file: File,
  acceptableFileExtensions: string[] | readonly string[]
): boolean {
  const fileExtension = getFileExtension(file)

  if (!fileExtension) {
    return false
  }

  return acceptableFileExtensions.includes(`.${fileExtension}`)
}

export async function readFileAsArrayBuffer(file: File) {
  return new Promise<FileReader>((resolve, reject) => {
    const fr = new FileReader()

    fr.onload = () => resolve(fr)
    fr.onerror = err => reject(err)
    fr.readAsArrayBuffer(file)
  })
}

export async function readFileAsText(file: File) {
  return new Promise<FileReader>((resolve, reject) => {
    const fr = new FileReader()

    fr.onload = () => resolve(fr)
    fr.onerror = err => reject(err)
    fr.readAsText(file)
  })
}

export function getDateTimeNowForFilename() {
  return new Date().toISOString()
    .replaceAll(':', '-')
    .replaceAll('T', '_')
    .replaceAll(/\.\d{3}Z/g, '')
}

export function downloadAsFile(
  filename: string,
  encodeURIComponentOrObjectUrl: string
) {
  const element = document.createElement('a')

  element.setAttribute('href', encodeURIComponentOrObjectUrl)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export function downloadAsTextFile(
  filename: string,
  text: string
) {
  const textContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)

  downloadAsFile(filename, textContent)
}

export function downloadAsBinaryFile(
  filename: string,
  content: BlobPart,
  mimetype = GZIP_FILE_MIME_TYPE
) {
  const binaryContent = window.URL.createObjectURL(new Blob([content], { type: mimetype }))

  downloadAsFile(filename, binaryContent)
}

export function serializeStateForJSONFile(
  storageStateObjectWithNotSerializedValues: StorageDataJsonOject
): string {
  return superjson.stringify(storageStateObjectWithNotSerializedValues)
}

export async function downloadStateAsJsonFile(stateToExport: { [key: string]: string }) {
  try {
    const stateToExportJsonString = serializeStateForJSONFile(stateToExport)

    const compressedJsonAsArrayBuffer = await compressStringToArrayBuffer(
      stateToExportJsonString,
      DUMP_COMPRESSION_FORMAT
    )

    if (compressedJsonAsArrayBuffer) {
      const filename = `${DUMP_FILENAME_PREFIX}${getDateTimeNowForFilename()}.${COMPRESSED_DUMP_FILE_EXTENSION}`

      downloadAsBinaryFile(filename, compressedJsonAsArrayBuffer, GZIP_FILE_MIME_TYPE)
      return
    }

    const filename = `${DUMP_FILENAME_PREFIX}${getDateTimeNowForFilename()}.${DUMP_FILE_EXTENSION}`

    downloadAsTextFile(filename, stateToExportJsonString)
  } catch (error) {
    console.error(error)
    return error
  }

  return
}

export function compressStringToArrayBuffer(
  text: string,
  encoding: CompressionFormat = DUMP_COMPRESSION_FORMAT
): Promise<ArrayBuffer> | undefined {
  try {
    const byteArray = new TextEncoder().encode(text)
    const compressionStream = new CompressionStream(encoding)

    const streamWriter = compressionStream.writable.getWriter()

    streamWriter.write(byteArray)
    streamWriter.close()

    return new Response(compressionStream.readable)
      .arrayBuffer()
  } catch (error) {
    console.error(error)
    return
  }
}

export function decompressArrayBufferToString(
  byteArray: ArrayBuffer,
  encoding: CompressionFormat = DUMP_COMPRESSION_FORMAT
): Promise<string> | undefined {
  try {
    const decompressionStream = new DecompressionStream(encoding)

    const streamWriter = decompressionStream.writable.getWriter()

    streamWriter.write(byteArray)
    streamWriter.close()

    return new Response(decompressionStream.readable)
      .arrayBuffer()
      .then(arrayBuffer => new TextDecoder().decode(arrayBuffer))
  } catch (error) {
    console.error(error)
    return
  }
}

export function deserializeStateFromJSONString(
  storageStatePropertyValueString: string
): StorageDataJsonOject {
  const storageStateObjectWithSerializedValues = superjson.parse<{ [key: string]: string }>(storageStatePropertyValueString)

  return storageStateObjectWithSerializedValues
}

export async function readFileAsJsonString(storageDataJsonFile: File) {
  let storageStateAsJsonString: string | undefined
  const fileExtension = getFileExtension(storageDataJsonFile)

  if (fileExtension === COMPRESSED_DUMP_FILE_EXTENSION) {
    const contentAsArrayBuffer = (await readFileAsArrayBuffer(storageDataJsonFile)).result as ArrayBuffer

    storageStateAsJsonString = await decompressArrayBufferToString(
      contentAsArrayBuffer,
      DUMP_COMPRESSION_FORMAT
    )
    if (!storageStateAsJsonString) {
      const message = `Upload file error. Impossible to decompress file (${DUMP_FILE_EXTENSION}.${GZIP_FILE_EXTENSION} format)`

      throw new Error(message)
    }
  } else if (fileExtension === DUMP_FILE_EXTENSION) {
    storageStateAsJsonString = (await readFileAsText(storageDataJsonFile)).result as string
    if (!storageStateAsJsonString) {
      const message = `Upload file error. Impossible to read file (${DUMP_FILE_EXTENSION} format)`

      throw new Error(message)
    }
  } else {
    const message = 'Upload file error. Unsupported file format'

    throw new Error(message)
  }

  return storageStateAsJsonString
}

export const STORAGE_STATE_ACCEPTABLE_FILE_EXTENSIONS = [
  `.${DUMP_FILE_EXTENSION}`,
  `.${COMPRESSED_DUMP_FILE_EXTENSION}`,
] as const

export const STORAGE_STATE_ACCEPTABLE_FILE_TYPES_AS_STRING
  = STORAGE_STATE_ACCEPTABLE_FILE_EXTENSIONS.join(', ')
