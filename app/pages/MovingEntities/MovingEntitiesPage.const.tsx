export const PAGE_TITLE_MOVING_ENTITIES = 'Moving entities'

export function PAGE_TITLE_MOVING_ENTITIES_WITH_SEARCH_PARAMS_FN({
  movingEntityName,
}: {
  movingEntityName?: string
}) {
  const titleParts = [
    movingEntityName,
  ].filter(v => !!v)

  if (!titleParts.length) {
    return `${PAGE_TITLE_MOVING_ENTITIES}`
  }

  return `Search ${titleParts.join(' ')} - ${PAGE_TITLE_MOVING_ENTITIES}`
}
