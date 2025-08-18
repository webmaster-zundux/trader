import type { ChangeEventHandler, InputHTMLAttributes } from 'react'
import { memo, useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import { blobToFile, convertAnyImageFileIntoWebpBlob } from '../../../utils/file/convertAnyImageFileIntoWebpFile'
import { readDataUrlAsBlob } from '../../../utils/file/readDataUrlAsBlob'
import { readFileAsDataURL } from '../../../utils/file/readFileAsDataURL'
import { Button } from '../../Button'
import styles from './ImageFileField.module.css'

type ImageFileFieldProps = {
  defaultValue?: string
  onFieldValueChange?: (fieldName: string, value: string | number) => void
  autoFocusOnFirstRender?: boolean
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'required' | 'onChange' | 'disabled' | 'accept'>
export const ImageFileField = memo(function ImageFileField({
  onFieldValueChange,
  name,
  defaultValue,
  autoFocusOnFirstRender,
  ...rest
}: Omit<ImageFileFieldProps, 'type'>) {
  const [blobUrl, setBlobUrl] = useState<string>()
  const [localValue, setLocalValue] = useState(defaultValue || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(function readDataUrlAsBlobEffect() {
    async function createDefaultValueBlobEffect() {
      if (!defaultValue?.length) {
        return
      }

      try {
        setIsLoading(true)
        const defaultValueBlob = await readDataUrlAsBlob(defaultValue)
        const defaultValueBlobUrl = URL.createObjectURL(defaultValueBlob)

        setBlobUrl(defaultValueBlobUrl)
        setIsLoading(false)
      } catch (error) {
        console.warn('Warning. FileField default value can not be readed as blob', error)
        setIsLoading(false)
      }
    }

    createDefaultValueBlobEffect()

    return function readDataUrlAsBlobEffectCleanup() {

    }
  }, [defaultValue, setBlobUrl, setIsLoading])

  useEffect(function revokeObjectUrlOfUnusedBlobUrlEffect() {
    if (!blobUrl) {
      return
    }

    const lastBlobUrl = blobUrl

    return function revokeObjectUrlOfUnusedBlobEffectCleanup() {
      URL.revokeObjectURL(lastBlobUrl)
    }
  }, [blobUrl])

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(async (event) => {
    let newImageAsBlob: Blob
    let newImageAsBlobUrl: string
    let newImageAsDataUrl: string

    try {
      const imageFile = event.target.files?.[0]

      if (!imageFile) {
        return
      }

      setIsUploading(true)
      newImageAsBlob = await convertAnyImageFileIntoWebpBlob(imageFile)
      newImageAsBlobUrl = URL.createObjectURL(newImageAsBlob)

      const webpImageFile = blobToFile(newImageAsBlob, `blob-converted-to-webp-format.webp`)
      const imageAsDataUrl = (await readFileAsDataURL(webpImageFile)).result

      if (typeof imageAsDataUrl !== 'string') {
        console.error('Error reading the image as data url')
        return
      }
      newImageAsDataUrl = imageAsDataUrl
    } catch (error) {
      console.error(error)
      setIsUploading(false)
      return
    }

    setLocalValue(newImageAsDataUrl)
    setBlobUrl(newImageAsBlobUrl)
    setIsUploading(false)

    if (typeof onFieldValueChange === 'function') {
      if (!name) {
        console.error('Error. Form field must have name')
        return
      }
      onFieldValueChange(name, newImageAsDataUrl)
      return
    }
  }, [setBlobUrl, setLocalValue, onFieldValueChange, name, setIsUploading])

  const handleOpenImageInFullSize = useCallback(function handleOpenImageInFullSize() {
    window.open(blobUrl)
  }, [blobUrl])

  const handleDeleteImage = useCallback(function handleDeleteImage() {
    setBlobUrl(undefined)
    setLocalValue('')
  }, [setBlobUrl, setLocalValue])

  const isDefaultValueExist = useMemo(() => {
    return !!localValue?.length
  }, [localValue])

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLInputElement>({ autoFocus: autoFocusOnFirstRender })

  const progressBarId = useId()
  const hasProgressBar = isLoading || isUploading

  return (
    <>
      {hasProgressBar && (
        <div className={styles.LoadingProgressBar}>
          <progress id={progressBarId} aria-labelledby={progressBarId}></progress>
          <label htmlFor={progressBarId}>
            {isUploading ? 'uploading' : 'loading'}
            {' '}
            image...
          </label>
        </div>
      )}
      {!hasProgressBar && (
        <>
          {isDefaultValueExist ? (
            <div className={styles.ExistingImageContainer}>
              <input
                type="hidden"
                name={name}
                defaultValue={localValue}
              />

              <div className={styles.ImageContainer}>
                <img
                  className={styles.Image}
                  src={blobUrl}
                  title="uploaded file preview"
                  alt="uploaded file preview"
                />

              </div>

              <div className={styles.ActionButtonGroup}>
                <Button
                  title="open full size in new tab"
                  onClick={handleOpenImageInFullSize}
                >
                  open full size
                </Button>

                <Button
                  title="delete image"
                  onClick={handleDeleteImage}
                >
                  delete image
                </Button>
              </div>

            </div>
          ) : (
            <input
              ref={autoFocusTargetRef}
              type="file"
              className={styles.ImageFileField}
              name={name}
              onChange={handleChange}
              {...rest}
            />
          )}
        </>
      )}
    </>
  )
})
