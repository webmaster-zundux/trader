import type { PropsWithChildren } from 'react'
import { memo, useCallback, useId, useMemo, useRef } from 'react'
import { useClickOutside } from '~/hooks/ui/useClickOutside'
import { useCloseOnEsc } from '~/hooks/ui/useCloseOnEsc'
import { useFocusOut } from '~/hooks/ui/useFocusOut'
import { cn } from '~/utils/ui/ClassNames'
import { Button } from '../Button'
import { useDialogOrder } from '../modals/hooks/useDialogOrder'
import styles from './Dialog.module.css'

interface DialogProps extends PropsWithChildren {
  title: (() => React.ReactNode) | React.ReactNode
  isTitleCentered?: boolean
  subTitle?: React.ReactNode
  noCloseButton?: boolean
  onHide?: () => void
}
export const Dialog = memo(function Dialog({
  title,
  isTitleCentered,
  subTitle,
  noCloseButton,
  onHide,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const currentModalDialog = useDialogOrder()

  const isShowCloseButton = useMemo(function a() {
    return (typeof onHide === 'function')
  }, [onHide])

  useClickOutside({ elementRef: dialogRef, onHide, currentModalDialog })
  useFocusOut({ elementRef: dialogRef, onHide, currentModalDialog })
  useCloseOnEsc({ onClose: onHide, currentModalDialog })

  const handleHide = useCallback(function handleHide() {
    if (typeof onHide !== 'function') {
      return
    }

    onHide()
  }, [onHide])

  const titleElementId = useId()
  const descriptionElementId = useId()

  return (
    <dialog
      ref={dialogRef}
      className={styles.DialogWrapper}
      aria-labelledby={titleElementId}
      {...(subTitle ? ({ 'aria-describedby': descriptionElementId }) : undefined)}
    >
      <div className={styles.DialogContainer}>

        {(!!title || !!subTitle) && (
          <div className={cn([
            styles.HeaderContainer,
            (noCloseButton || !isShowCloseButton) && styles.NoPaddingForCloseButton
          ])}
          >
            <div className={styles.TitleContainer}>
              <h2
                className={cn([
                  styles.Title,
                  isTitleCentered && styles.CenterText,
                ])}
                id={titleElementId}
              >
                {
                  (typeof title === 'function')
                    ? title()
                    : title
                }
              </h2>

              {!!subTitle && (
                <div className={styles.SubTitle} id={descriptionElementId}>
                  {subTitle}
                </div>
              )}
            </div>

          </div>
        )}

        {children}

        {(!noCloseButton && isShowCloseButton) && (
          <div className={styles.CloseButtonContainer}>
            <Button
              size="small"
              transparent
              noBorder
              noPadding
              onClick={handleHide}
              title="close"
            >
              <i className="icon icon-close"></i>
            </Button>
          </div>
        )}
      </div>
    </dialog>
  )
})
