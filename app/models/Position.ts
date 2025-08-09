/**
 * Position [ x, y, z ]
 */
export type Position = [number, number, number]

export function isPosition(position: unknown): position is Position {
  return (
    (typeof position === 'object')
    && (position instanceof Array)
    && (position.length === 3)
    && (
      (
        Number.isFinite(position[0])
        && Number.isFinite(position[1])
        && Number.isFinite(position[2])
      )
    )
  )
}

/**
 * @param positionAsString - a string in format `[ +00100, -0102030, 0 ]` or `100,-10203,0` or `100 -10203 0`
 * @returns Position as [number, number, number]
 */
export function parsePositionFromString(
  positionAsString: unknown
): Position | undefined {
  if (
    (typeof positionAsString !== 'string')
    || !positionAsString
  ) {
    return undefined
  }

  const positionDataString = positionAsString.match(/\[?\s*[+-]?[0-9]+\s*(,|\s)\s*[+-]?[0-9]+\s*(,|\s)\s*[+-]?[0-9]+\s*\]?/i)?.[0]

  if (!positionDataString) {
    return undefined
  }

  const position: Position = positionDataString
    .replace(/\s+/gi, ' ')
    .replace(/^[[\]\s]*/gi, '')
    .replace(/[[\]\s]*$/gi, '')
    .replace(/\s*/gi, '')
    .split(',')
    .map(value => Number.parseFloat(value)) as Position

  if (!isPosition(position)) {
    return undefined
  }

  return position
}

/**
 * @param position [number, number, number]
 * @returns string `[0,+1,-1]` or `[ 0, +1, -1 ]`
 */
export function positionToString(
  position: Position,
  humanized: boolean = false,
  minNumberOfSymbolsForEachPart: number = 0,
  placeholderSymbol: string = '0'
): string {
  const positionAsArrayOfStrings = position.map((value) => {
    return addLeadingSymbols(value, minNumberOfSymbolsForEachPart, placeholderSymbol, true, true)
  })

  if (humanized) {
    return `[ ${positionAsArrayOfStrings.join(', ')} ]`
  }

  return `[${positionAsArrayOfStrings.join(',')}]`
}

function addLeadingSymbols(
  value: number,
  minNumberOfSymbols = 0,
  placeholderSymbol = '0',
  signPositionBeforePlaceholderSymbols = true,
  showPositiveValueSign = true
): string {
  const signSymbol = value < 0 ? '-' : ((showPositiveValueSign && (value > 0)) ? '+' : ' ')
  const signBefore = signPositionBeforePlaceholderSymbols ? signSymbol : ''
  const signAfter = signPositionBeforePlaceholderSymbols ? '' : signSymbol

  const valueAsString = Math.abs(value).toString()
  let numberOfPlaceholdSymbols = minNumberOfSymbols - valueAsString.length

  if (numberOfPlaceholdSymbols < 0) {
    numberOfPlaceholdSymbols = 0
  }
  const placeholder = new Array(numberOfPlaceholdSymbols).fill(placeholderSymbol).join('')

  return `${signBefore}${placeholder}${signAfter}${Math.abs(value)}`
}
