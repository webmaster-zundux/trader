import type { PropsWithChildren } from 'react'
import { useAutoFocusOnElementOnFirstRender } from '../../../hooks/ui/useAutoFocusOnElementOnFirstRender'
import { Button } from '../../Button'
import { Modal } from '../Modal'
import styles from './ModalNotification.module.css'

export interface ModalNotificationProps extends PropsWithChildren {
  title: React.ReactNode
  onHide?: () => void
  okButtonLabel?: string
}
export function ModalNotification({
  title = 'notification',
  onHide,
  okButtonLabel = 'ok',
  children,
}: ModalNotificationProps) {
  const autoFocusTargetRef = useAutoFocusOnElementOnFirstRender<HTMLButtonElement>({ autoFocus: true })

  return (
    <Modal
      title={title}
      isTitleCentered
      onHide={onHide}
      noCloseButton
    >

      {children}

      <div className={styles.ActionButtons}>
        {(typeof onHide === 'function') && (
          <Button onClick={onHide} style={{ minWidth: '7em' }} ref={autoFocusTargetRef}>
            {okButtonLabel}
          </Button>
        )}
      </div>
    </Modal>
  )
}
