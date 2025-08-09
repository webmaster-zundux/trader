import type React from 'react'
import type { PropsWithChildren } from 'react'
import { memo, useCallback, useId, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useCloseOnEsc } from '../../hooks/ui/useCloseOnEsc'
import { useLockBodyScrollOfElement, useLockBodyScrollOfParentModalDialogOrAppRoot } from '../../hooks/ui/useLockBodyScroll'
import { useMadeInertParentModalDialogOrAppRoot } from '../../hooks/ui/useMadeInertParentModalDialogOrAppRoot'
import { cn } from '../../utils/ui/ClassNames'
import { createModalDialogElementId } from '../../utils/ui/createModalDialogElementId'
import { Button } from '../Button'
import { CloseIcon } from '../icons/CloseIcon'
import styles from './Modal.module.css'
import { useDialogOrder } from './hooks/useDialogOrder'

interface ModalProps extends PropsWithChildren {
  title: React.ReactNode
  isTitleCentered?: boolean
  subTitle?: React.ReactNode
  size?: 'tiny' | 'small' | 'medium' | 'large'
  noCloseButton?: boolean
  onHide?: () => void
}
function ModalByReactPortal({
  title,
  isTitleCentered,
  subTitle,
  size,
  noCloseButton,
  onHide,
  children
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const currentModalDialog = useDialogOrder()

  useLockBodyScrollOfElement(modalRef, currentModalDialog)
  useLockBodyScrollOfParentModalDialogOrAppRoot(modalRef, currentModalDialog)
  useMadeInertParentModalDialogOrAppRoot(modalRef, currentModalDialog)

  useCloseOnEsc({ onClose: onHide, currentModalDialog })

  const handleHide = useCallback(function handleHide() {
    if (typeof onHide !== 'function') {
      return
    }

    onHide()
  }, [onHide])

  const isShowCloseButton = useMemo(function a() {
    return (typeof onHide === 'function')
  }, [onHide])

  const titleElementId = useId()
  const descriptionElementId = useId()

  const modalDialogElementId = useMemo(function createModalDialogElementIdMemo() {
    if (!currentModalDialog) {
      return undefined
    }

    return createModalDialogElementId(currentModalDialog.uuid)
  }, [currentModalDialog])

  return createPortal(
    (
      <>
        {!!modalDialogElementId && (
          <div ref={modalRef} className={styles.ModalWrapper} id={modalDialogElementId}>
            <div className={styles.Backdrop} onClick={handleHide} role="presentation"></div>
            <div
              className={cn([
                styles.ModalContainer,
                (!size || (size === 'tiny')) && styles.SizeTiny,
                (size === 'small') && styles.SizeSmall,
                (size === 'medium') && styles.SizeMedium,
                (size === 'large') && styles.SizeLarge,
              ])}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleElementId}
              {...(subTitle ? ({ 'aria-describedby': descriptionElementId }) : undefined)}
            >

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
                      {title}
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
                    <CloseIcon />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    ),
    document.body
  )
}

export const Modal = memo(ModalByReactPortal)
