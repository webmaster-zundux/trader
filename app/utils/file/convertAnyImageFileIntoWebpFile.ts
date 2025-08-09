import { readFileAsDataURL } from './readFileAsDataURL'

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type })
}

export async function convertAnyImageFileIntoWebpFile(sourceImageFile: File): Promise<File> {
  const imageAsDataUrl = (await readFileAsDataURL(sourceImageFile)).result

  if (typeof imageAsDataUrl !== 'string') {
    return Promise.reject('Error. Reading the image as data url failed')
  }

  return new Promise((resolve, reject) => {
    try {
      const originalImage = new Image()

      originalImage.onload = function onLoad() {
        try {
          const canvas = document.createElement('canvas')

          canvas.width = originalImage.naturalWidth
          canvas.height = originalImage.naturalHeight

          const canvasContext = canvas.getContext('2d')

          if (!canvasContext) {
            reject('Error. Canvas 2d rendering context is not supported')
            return
          }

          function blobCallback(blob: Blob | null) {
            if (!blob) {
              reject('Error. Impossible to read image data as blob from canvas')
              return
            }

            const webpFile = blobToFile(blob, `blob-converted-to-webp-format.webp`)

            resolve(webpFile)
          }

          canvasContext.drawImage(originalImage, 0, 0)
          canvas.toBlob(blobCallback, 'image/webp')
        } catch (error) {
          reject(error)
        }
      }

      originalImage.onerror = error => reject(error)

      originalImage.src = imageAsDataUrl
    } catch (error) {
      reject(error)
    }
  })
}

export async function convertAnyImageFileIntoWebpBlob(
  sourceImageFile: File,
  svgResolution?: { width: number, height: number }
): Promise<Blob> {
  const blob = new Blob([await sourceImageFile.arrayBuffer()])
  const blobUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    try {
      const originalImage = new Image()

      originalImage.onload = function onLoad() {
        try {
          URL.revokeObjectURL(blobUrl)
          const canvas = document.createElement('canvas')

          if (sourceImageFile.type === 'image/svg') {
            canvas.width = svgResolution?.width || originalImage.naturalWidth
            canvas.height = svgResolution?.height || originalImage.naturalHeight
          } else {
            canvas.width = originalImage.naturalWidth
            canvas.height = originalImage.naturalHeight
          }

          const canvasContext = canvas.getContext('2d')

          if (!canvasContext) {
            reject('Error. Canvas 2d rendering context is not supported')
            return
          }

          function blobCallback(blob: Blob | null) {
            if (!blob) {
              reject('Error. Impossible to read image data as blob from canvas')
              return
            }

            resolve(blob)
          }

          canvasContext.drawImage(originalImage, 0, 0)
          canvas.toBlob(blobCallback, 'image/webp')
        } catch (error) {
          reject(error)
        }
      }

      originalImage.onerror = error => reject(error)

      originalImage.src = blobUrl
    } catch (error) {
      reject(error)
    }
  })
}
