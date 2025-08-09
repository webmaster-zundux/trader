import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_SPACE_AREA = 'space-area' as const

export type SpaceArea = Entity & {
  entityType: typeof ENTITY_TYPE_SPACE_AREA

  name: string // uniq
  position?: string // uniq
}
export type SpaceAreaAttributes = keyof SpaceArea

export const SPACE_AREA_ATTRIBUTES: SpaceAreaAttributes[] = ([
  'uuid',
  'entityType',
  'name',
  'position'
] as const) satisfies SpaceAreaAttributes[]

export const SPACE_AREA_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(SPACE_AREA_ATTRIBUTES)

export function isArea(value: unknown): value is SpaceArea {
  return ((value as SpaceArea)?.entityType === ENTITY_TYPE_SPACE_AREA)
}
