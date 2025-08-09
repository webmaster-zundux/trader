export const FULL_LOCATION_NAME_PART_SEPARATOR = ' - '

export function createNameFromParts(
  nameParts: (string | undefined)[] = [],
  reverse = false,
  namePartSeparator = FULL_LOCATION_NAME_PART_SEPARATOR
): string {
  let parts = nameParts
    .filter(v => !!v)

  if (reverse) {
    parts = parts.reverse()
  }

  return parts.join(namePartSeparator)
}
