import type React from 'react'
import { memo, useMemo } from 'react'
import type { Promisefy } from '~/models/utils/utility-types'
import { ModalConfirmation } from './ModalConfirmation'

interface LoadDemoDataConfirmationProps {
  onConfirm?: () => Promisefy<(string | (() => React.JSX.Element) | undefined | void)>
  onHide?: () => void
}
export const LoadDemoDataConfirmation = memo(function LoadDemoDataConfirmation({
  onHide,
  onConfirm,
}: LoadDemoDataConfirmationProps) {
  const confirmationTitle = useMemo(() => (
    <>
      Are you sure you want
      {' '}
      <strong>to load demo data</strong>
      ?
      <br />
      All existing data will be exported into a file
    </>
  ), [])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={onHide}
      onConfirm={onConfirm}
      confirmButtonLabel="load demo data"
    />
  )
})
