export function appendSuffixToLabel(
  value: string | undefined,
  suffix: string,
  suffixBeginning = '<',
  suffixEnding = '>'
): string {
  if (!value) {
    return ''
  }

  return `${value} ${suffixBeginning}${suffix}${suffixEnding}`
}
