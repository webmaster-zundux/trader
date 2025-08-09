import { useMemo } from 'react'
import { NoDataCell } from '~/components/Table'
import { parsePositionFromString, positionToString } from '~/models/Position'

export const NUMBER_OF_SYMBOLS_IN_EACH_PART_OF_POSITION_DATA = 7
export const PLACEHOLDER_SYMBOL_IN_EACH_PART_OF_POSITION_DATA = '0'

export function FormattedPositionForLocationAndMovingEntity({ value }: { value: unknown }) {
  const position = useMemo(function positionMemo() {
    return parsePositionFromString(value)
  }, [value])

  const positionAsString = useMemo(function positionStringMemo() {
    if (!position) {
      return undefined
    }

    return positionToString(position, false, NUMBER_OF_SYMBOLS_IN_EACH_PART_OF_POSITION_DATA, PLACEHOLDER_SYMBOL_IN_EACH_PART_OF_POSITION_DATA)
  }, [position])

  return (
    <>
      {(typeof positionAsString === 'string')
        ? positionAsString
        : (
            <NoDataCell>
              (no&nbsp;data)
            </NoDataCell>
          )}
    </>
  )
}
