import type React from 'react'
import { memo, useMemo } from 'react'
import type { Promisefy } from '~/models/utils/utility-types'
import { ModalConfirmation } from './ModalConfirmation'

interface ClearStorageConfirmationProps {
  onConfirm?: () => Promisefy<(string | (() => React.JSX.Element) | undefined | void)>
  onHide?: () => void
}
export const ClearStorageConfirmation = memo(function ClearStorageConfirmation({
  onHide,
  onConfirm,
}: ClearStorageConfirmationProps) {
  const confirmationTitle = useMemo(() => (
    <>
      Are you sure you want
      {' '}
      <strong>to clear data storage</strong>
      ?
      <br />
      All data will be deleted
    </>
  ), [])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={onHide}
      onConfirm={onConfirm}
      confirmButtonLabel="clear storage"
    />
  )
})
