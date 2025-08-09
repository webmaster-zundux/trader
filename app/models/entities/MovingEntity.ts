import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'
import type { Location } from './Location'
import type { PlanetarySystem } from './PlanetarySystem'

export const ENTITY_TYPE_MOVING_ENTITY = 'moving-entity' as const

export type MovingEntity = Entity & {
  entityType: typeof ENTITY_TYPE_MOVING_ENTITY

  id?: string // note: always in upper case // uniq
  originalId?: string // note: always in upper case // uniq

  name: string
  movingEntityClassUuid?: string

  position?: string
  locationUuid: PlanetarySystem['uuid'] | Location['uuid']
  homeLocationUuid: PlanetarySystem['uuid'] | Location['uuid']
  destinationLocationUuid: PlanetarySystem['uuid'] | Location['uuid']

  cargo?: string

  combatShield?: [number, number]
  combatLaser?: [number, number]
  combatMissiles?: number

  note?: string
}
export type MovingEntityAttributes = keyof MovingEntity

export const MOVING_ENTITY_ATTRIBUTES: MovingEntityAttributes[] = ([
  'uuid',
  'entityType',
  'id',
  'originalId',
  'name',
  'position',
  'locationUuid',
  'homeLocationUuid',
  'destinationLocationUuid',
  'movingEntityClassUuid',
  'cargo',
  'combatShield',
  'combatLaser',
  'combatMissiles',
  'note',
] as const) satisfies MovingEntityAttributes[]

export const MOVING_ENTITY_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(MOVING_ENTITY_ATTRIBUTES)

export function isMovingEntity(value: unknown): value is MovingEntity {
  return ((value as MovingEntity)?.entityType === ENTITY_TYPE_MOVING_ENTITY)
}
