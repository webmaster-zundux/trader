const suffixesBiggerThanOne = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q']
const suffixesSmallerThanOne = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y', 'r', 'q']

/**
 * Returns value as string with metrix prefix (e.g. 1.000k, 800.000M, 1.234n) and string's length in range 6-8 symbols
 *
 * Uses prefixes for value bigger  than 1 ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q']
 * Uses prefixes for value smaller than 1 ['m', 'μ', 'n', 'p', 'f', 'a', 'z', 'y', 'r', 'q']
 *
 * https://en.wikipedia.org/wiki/Metric_prefix
 *
 * @param originalValue integer or float number
 * @returns
 */
export function humanizeQuantity(originalValue: number, symbolsAfterPoint: number = 3): string {
  let value = originalValue
  let suffix = ''
  let valueString = `${+(value).toPrecision(symbolsAfterPoint)}${suffix}`
  let index = 0

  if (Math.abs(value) >= 1) {
    while (value >= 1000) {
      index++
      suffix = suffixesBiggerThanOne[index]
      if (!suffix) {
        break
      }
      value = value / 1000
      valueString = `${+(value).toPrecision(symbolsAfterPoint)}${suffix}`
    }
  } else {
    while ((Math.abs(value) > 0) && (Math.abs(value) <= 0.001)) {
      index++
      suffix = suffixesSmallerThanOne[index]
      if (!suffix) {
        break
      }
      value = value * 1000
      valueString = `${+(value).toPrecision(symbolsAfterPoint)}${suffix}`
    }
  }

  return valueString
}
