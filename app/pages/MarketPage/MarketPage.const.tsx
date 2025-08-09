export const PAGE_TITLE_MARKET = 'Market'

export function PAGE_TITLE_MARKET_WITH_SEARCH_PARAMS_FN({
  productName,
  locationName,
}: {
  productName?: string
  locationName?: string
}) {
  const titleParts = [
    productName,
    !!locationName && `in ${locationName}`
  ].filter(v => !!v)

  if (!titleParts.length) {
    return `${PAGE_TITLE_MARKET}`
  }

  return `Search ${titleParts.join(' ')} - ${PAGE_TITLE_MARKET}`
}
