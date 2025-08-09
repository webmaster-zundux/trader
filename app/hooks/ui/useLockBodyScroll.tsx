import type React from 'react'
import { useEffect } from 'react'
import { APP_ROOT_ELEMENT_ID } from '../../main.const'
import type { ModalDialog } from '../../models/modal-dialogs/ModalDialog'
import { getParentModalDialogSelector, getTheLatestModalDialogSelector } from '../../stores/modal-dialog-stores/ModalDialogs.store'
import { createModalDialogElementId } from '../../utils/ui/createModalDialogElementId'

function isBodyVerticleScrollBarVisible() {
  const documentRootElement = document.documentElement

  return (
    documentRootElement.scrollHeight > documentRootElement.clientHeight
  )
}

function tryToLockBodyScroll(currentElement: HTMLElement): Pick<CSSStyleDeclaration, 'overflow' | 'paddingRight'> | undefined {
  const elementComputedStyle = window.getComputedStyle(currentElement)
  const originalOverflowParameterValue = elementComputedStyle.overflow

  if (originalOverflowParameterValue === 'hidden') {
    return undefined
  }

  const currentElementStyle = currentElement.style
  const originalScrollbarSizeAsPaddingParameterValue = elementComputedStyle.paddingRight

  currentElementStyle.overflow = 'hidden'

  if (isBodyVerticleScrollBarVisible()) {
    currentElementStyle.paddingRight = '0.5em'
  }

  return {
    overflow: originalOverflowParameterValue,
    paddingRight: originalScrollbarSizeAsPaddingParameterValue,
  }
}

function unlockBobyScroll(currentElement: HTMLElement, originalValues: Pick<CSSStyleDeclaration, 'overflow' | 'paddingRight'>) {
  const currentElementStyle = currentElement.style

  currentElementStyle.overflow = originalValues.overflow
  currentElementStyle.paddingRight = originalValues.paddingRight
}

export function useLockBodyScrollOfElement(
  elementRef: React.RefObject<HTMLDivElement | null>,
  currentModalDialog?: ModalDialog | undefined
) {
  useEffect(function lockSelfBodyScrollEffect() {
    const currentElement = elementRef.current

    if (!currentElement) {
      return
    }

    if (!currentModalDialog) {
      return
    }

    const theLatestModalDialog = getTheLatestModalDialogSelector()

    if (Object.is(currentModalDialog, theLatestModalDialog)) {
      return
    }

    const originalStyleValues = tryToLockBodyScroll(currentElement)

    if (!originalStyleValues) {
      return
    }

    return function lockSelfBodyScrollEffectCleanup() {
      unlockBobyScroll(currentElement, originalStyleValues)
    }
  }, [elementRef, currentModalDialog])
}

export function useLockBodyScrollOfParentModalDialogOrAppRoot(
  elementRef: React.RefObject<HTMLDivElement | null>,
  currentModalDialog?: ModalDialog | undefined
) {
  useEffect(function lockParentBodyScrollEffect() {
    const currentElement = elementRef.current

    if (!currentElement) {
      return
    }

    if (!currentModalDialog) {
      return
    }

    const parentModalDialog = getParentModalDialogSelector()

    if (!parentModalDialog?.uuid) {
      return
    }

    const parentModalDialogElementId = createModalDialogElementId(parentModalDialog.uuid)
    let parentElement = document.getElementById(parentModalDialogElementId) as HTMLDivElement

    if (!parentElement) {
      parentElement = document.getElementById(APP_ROOT_ELEMENT_ID) as HTMLDivElement
      if (!parentElement) {
        return
      }
    }

    const originalStyleValues = tryToLockBodyScroll(parentElement)

    if (!originalStyleValues) {
      return
    }

    return function lockParentBodyScrollEffectCleanup() {
      unlockBobyScroll(parentElement, originalStyleValues)
    }
  }, [elementRef, currentModalDialog])
}
