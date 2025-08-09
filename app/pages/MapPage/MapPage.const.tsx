export const PAGE_TITLE_MAP = 'Map'

export function PAGE_TITLE_MAP_WITH_SEARCH_PARAMS_FN({
  movingEntityName,
  locationName,
}: {
  movingEntityName?: string
  locationName?: string
}) {
  const titleParts = [
    movingEntityName,
    !!locationName && (
      movingEntityName
        ? `in ${locationName}`
        : `${locationName}`
    ),
  ].filter(v => !!v)

  if (!titleParts.length) {
    return `${PAGE_TITLE_MAP}`
  }

  return `${titleParts.join(' ')} - ${PAGE_TITLE_MAP}`
}
