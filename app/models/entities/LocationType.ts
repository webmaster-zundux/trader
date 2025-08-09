import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_LOCATION_TYPE = 'location-type' as const

export type LocationType = Entity & {
  entityType: typeof ENTITY_TYPE_LOCATION_TYPE

  name: string // uniq
  image?: string
}
export type LocationTypeAttributes = keyof LocationType

export const LOCATION_TYPE_ATTRIBUTES: LocationTypeAttributes[] = ([
  'uuid',
  'name',
  'image',
] as const) satisfies LocationTypeAttributes[]

export const LOCATION_TYPE_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(LOCATION_TYPE_ATTRIBUTES)

export function isLocationType(value: unknown): value is LocationType {
  return ((value as LocationType)?.entityType === ENTITY_TYPE_LOCATION_TYPE)
}
