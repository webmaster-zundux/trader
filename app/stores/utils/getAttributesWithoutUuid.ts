import type { Entity } from '../../models/Entity'
import type { WithoutUUID } from '../../models/utils/utility-types'

export function getAttributesNamesWithoutUuid<
  T extends Entity = Entity
>(
  attributesNames: (keyof T)[]
): (keyof WithoutUUID<T>)[] {
  return attributesNames.filter((attributeName): attributeName is keyof T => attributeName !== 'uuid') as (keyof WithoutUUID<T>)[]
}
