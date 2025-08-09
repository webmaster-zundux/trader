import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'
import type { LocationType } from './LocationType'
import { type PlanetarySystem } from './PlanetarySystem'

export const ENTITY_TYPE_LOCATION = 'location' as const

export type Location = Entity & {
  entityType: typeof ENTITY_TYPE_LOCATION

  id?: string // note: always in upper case // uniq
  name: string

  position?: string
  planetarySystemUuid?: PlanetarySystem['uuid']

  locationTypeUuid?: LocationType['uuid']
}
export type LocationAttributes = keyof Location

export const LOCATION_ATTRIBUTES: LocationAttributes[] = ([
  'uuid',
  'entityType',
  'id',
  'name',
  'position',
  'planetarySystemUuid',
  'locationTypeUuid',
] as const) satisfies LocationAttributes[]

export const LOCATION_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(LOCATION_ATTRIBUTES)

export function isLocation(value: unknown): value is Location {
  return ((value as Location)?.entityType === ENTITY_TYPE_LOCATION)
}
