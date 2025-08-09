import { MovingEntitiesPage } from '~/pages/MovingEntities/MovingEntitiesPage'
import { createPageTitleString } from './utils/createPageTitleString'
import { PAGE_TITLE_MOVING_ENTITIES } from '~/pages/MovingEntities/MovingEntitiesPage.const'

export function meta() {
  return [
    { title: createPageTitleString(PAGE_TITLE_MOVING_ENTITIES) },
  ]
}

export default function MovingEntities() {
  return <MovingEntitiesPage />
}
