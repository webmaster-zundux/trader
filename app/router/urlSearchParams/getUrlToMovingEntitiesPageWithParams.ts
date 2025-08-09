import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { PAGE_SLUG_MOVING_ENTITIES } from '../PageSlugs.const'
import { URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from './UrlSearchParamsKeys.const'

export function getUrlToMovingEntitiesPageWithParams({
  movingEntityId,
  movingEntityName,
  movingEntityClassName,
  planetarySystemName,
}: {
  movingEntityId?: MovingEntity['id']
  movingEntityName?: MovingEntity['name']
  movingEntityClassName?: MovingEntityClass['name']
  planetarySystemName?: PlanetarySystem['name']
}): string | undefined {
  const urlSearchParams = new URLSearchParams()

  if ((typeof movingEntityId === 'string') && !!movingEntityId) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, movingEntityId)
  }

  if ((typeof movingEntityName === 'string') && !!movingEntityName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, movingEntityName)
  }

  if ((typeof movingEntityClassName === 'string') && !!movingEntityClassName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME, movingEntityClassName)
  }

  if ((typeof planetarySystemName === 'string') && !!planetarySystemName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, planetarySystemName)
  }

  if (!urlSearchParams.size) {
    return undefined
  }

  return `/${PAGE_SLUG_MOVING_ENTITIES}?${urlSearchParams.toString()}`
}
