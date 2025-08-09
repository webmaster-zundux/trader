export const PAGE_TITLE_PRODUCTS = 'Products'

export function PAGE_TITLE_PRODUCTS_WITH_SEARCH_PARAMS_FN({
  productName,
}: {
  productName?: string
}) {
  const titleParts = [
    productName,
  ].filter(v => !!v)

  if (!titleParts.length) {
    return `${PAGE_TITLE_PRODUCTS}`
  }

  return `Search ${titleParts.join(' ')} - ${PAGE_TITLE_PRODUCTS}`
}
