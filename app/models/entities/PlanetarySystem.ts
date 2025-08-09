import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_PLANETARY_SYSTEM = 'planetary-system' as const

export type PlanetarySystem = Entity & {
  entityType: typeof ENTITY_TYPE_PLANETARY_SYSTEM

  name: string // note: always in lowerCase // uniq
  position?: string
}
export type PlanetarySystemAttributes = keyof PlanetarySystem

export const PLANETARY_SYSTEM_ATTRIBUTES: PlanetarySystemAttributes[] = ([
  'uuid',
  'entityType',
  'name',
  'position'
] as const) satisfies PlanetarySystemAttributes[]

export const PLANETARY_SYSTEM_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(PLANETARY_SYSTEM_ATTRIBUTES)

export function isPlanetarySystem(value: unknown): value is PlanetarySystem {
  return ((value as PlanetarySystem)?.entityType === ENTITY_TYPE_PLANETARY_SYSTEM)
}
