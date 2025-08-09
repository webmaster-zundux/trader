import { NoDataCell } from '~/components/Table'

export function FormattedIdForMovingEntity({ value }: { value: unknown }) {
  return (
    <>
      {(typeof value === 'string')
        ? value
        : (
            <NoDataCell>
              (no&nbsp;id)
            </NoDataCell>
          )}
    </>
  )
}
