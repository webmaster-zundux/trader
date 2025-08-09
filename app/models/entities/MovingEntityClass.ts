import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_MOVING_ENTITY_CLASS = 'moving-entity-class' as const

export type MovingEntityClass = Entity & {
  entityType: typeof ENTITY_TYPE_MOVING_ENTITY_CLASS

  name: string // uniq
  note?: string
  image?: string
}
export type MovingEntityClassAttributes = keyof MovingEntityClass

export const MOVING_ENTITY_CLASS_ATTRIBUTES: MovingEntityClassAttributes[] = ([
  'uuid',
  'entityType',
  'name',
  'note',
  'image',
] as const) satisfies MovingEntityClassAttributes[]

export const MOVING_ENTITY_CLASS_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(MOVING_ENTITY_CLASS_ATTRIBUTES)

export function isMovingEntityClass(value: unknown): value is MovingEntityClass {
  return ((value as MovingEntityClass)?.entityType === ENTITY_TYPE_MOVING_ENTITY_CLASS)
}
