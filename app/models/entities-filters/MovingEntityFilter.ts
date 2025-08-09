import type { Location } from '../entities/Location'
import type { MovingEntityClass } from '../entities/MovingEntityClass'
import type { PlanetarySystem } from '../entities/PlanetarySystem'
import type { EntityBaseFilter } from './EntityBaseFilter'

export const ENTITY_TYPE_MOVING_ENTITY_FILTER = 'moving-entities-filter' as const

export type MovingEntityFilter = EntityBaseFilter & {
  movingEntityClassUuid?: MovingEntityClass['uuid']

  locationUuid?: Location['uuid'] | PlanetarySystem['uuid']
  homeLocationUuid?: Location['uuid'] | PlanetarySystem['uuid']
  destinationLocationUuid?: Location['uuid'] | PlanetarySystem['uuid']
}

export type MovingEntityFilterAttributes = keyof MovingEntityFilter

export const MOVING_ENTITY_FILTER_ATTRIBUTES: MovingEntityFilterAttributes[] = ([
  'locationUuid',
  'homeLocationUuid',
  'destinationLocationUuid',
  'movingEntityClassUuid',
] as const) satisfies MovingEntityFilterAttributes[]
