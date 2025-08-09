export const PAGE_TITLE_LOCATIONS = 'Locations'

export function PAGE_TITLE_LOCATIONS_WITH_SEARCH_PARAMS_FN({
  locationName,
  planetarySystemName,
}: {
  locationName?: string
  planetarySystemName?: string
}) {
  const titleParts = [
    locationName,
    !!planetarySystemName && `in ${planetarySystemName}`
  ].filter(v => !!v)

  if (!titleParts.length) {
    return `${PAGE_TITLE_LOCATIONS}`
  }

  return `Search ${titleParts.join(' ')} - ${PAGE_TITLE_LOCATIONS}`
}
