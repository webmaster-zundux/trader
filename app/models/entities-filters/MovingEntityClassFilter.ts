import type { EntityBaseFilter } from './EntityBaseFilter'

export const ENTITY_TYPE_MOVING_ENTITY_CLASS_FILTER = 'moving-entity-classes-filter' as const

export type MovingEntityClassFilter = EntityBaseFilter & {}

export type MovingEntityClassFilterAttributes = keyof MovingEntityClassFilter

export const MOVING_ENTITY_CLASS_FILTER_ATTRIBUTES: MovingEntityClassFilterAttributes[] = ([
] as const) satisfies MovingEntityClassFilterAttributes[]
