import { useMemo } from 'react'
import { NoDataCell } from '~/components/Table'
import { parsePositionFromString, positionToString } from '~/models/Position'

const NUMBER_OF_SYMBOLS_IN_EACH_PART_OF_POSITION_DATA_FOR_PLANETARY_SYSTEM = 0
const PLACEHOLDER_SYMBOL_IN_EACH_PART_OF_POSITION_DATA_FOR_PLANETARY_SYSTEM = '0'

export function FormattedPositionForPlanetarySystem({ value }: { value: unknown }) {
  const position = useMemo(function positionMemo() {
    return parsePositionFromString(value)
  }, [value])

  const positionString = useMemo(function positionStringMemo() {
    if (!position) {
      return undefined
    }

    return positionToString(position, false, NUMBER_OF_SYMBOLS_IN_EACH_PART_OF_POSITION_DATA_FOR_PLANETARY_SYSTEM, PLACEHOLDER_SYMBOL_IN_EACH_PART_OF_POSITION_DATA_FOR_PLANETARY_SYSTEM)
  }, [position])

  return (
    <>
      {(typeof positionString === 'string')
        ? positionString
        : (
            <NoDataCell>
              (no&nbsp;data)
            </NoDataCell>
          )}
    </>
  )
}
