import { memo, useCallback } from 'react'
import type { Promisefy } from '~/models/utils/utility-types'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import { Button } from '../../Button'
import { Modal } from '../Modal'
import styles from './ModalConfirmation.module.css'

export interface ModalConfirmationProps {
  title: React.ReactNode
  hideButtonLabel?: string
  onConfirm?: () => Promisefy<(string | (() => React.JSX.Element) | undefined | void)>
  confirmButtonLabel?: string
  onHide?: () => void
}
export const ModalConfirmation = memo(function ModalConfirmation({
  title = 'are you want to proceed?',
  onHide,
  hideButtonLabel = 'cancel',
  onConfirm,
  confirmButtonLabel = 'confirm',
}: ModalConfirmationProps) {
  const handleHide = useCallback(() => {
    if (typeof onHide !== 'function') {
      return
    }

    onHide()
  }, [onHide])

  const handleConfirm = useCallback(async function handleConfirm() {
    if (typeof onConfirm !== 'function') {
      return
    }

    const error = await onConfirm()

    if (error) {
      return
    }

    handleHide()
  }, [onConfirm, handleHide])

  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLButtonElement>({ autoFocus: true })

  return (
    <Modal
      title={title}
      onHide={handleHide}
      noCloseButton
      isTitleCentered
    >
      <div className={styles.ActionButtons}>
        <Button onClick={handleHide} ref={autoFocusTargetRef}>
          {hideButtonLabel}
        </Button>
        {(typeof onConfirm === 'function') && (
          <Button primary onClick={handleConfirm}>
            {confirmButtonLabel}
          </Button>
        )}
      </div>
    </Modal>
  )
})
