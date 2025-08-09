import type { WithoutUUID } from './utility-types'

import type { Entity } from '../Entity'

export function hasUuid<T extends Entity = Entity>(instance: T | WithoutUUID<T>): instance is T {
  return !!((instance as T).uuid)
}
