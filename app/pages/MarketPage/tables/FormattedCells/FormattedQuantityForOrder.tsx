import { NoDataCell } from '~/components/Table'

export function FormattedQuantityForOrder({ value }: { value: unknown }) {
  return (
    <>
      {(typeof value === 'number' && value > 0) ? value : (
        <NoDataCell>
          0
        </NoDataCell>
      )}
    </>
  )
}
