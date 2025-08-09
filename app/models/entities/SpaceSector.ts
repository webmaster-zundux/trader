import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_SPACE_SECTOR = 'space-sector' as const

export type SpaceSector = Entity & {
  entityType: typeof ENTITY_TYPE_SPACE_SECTOR

  name: string
  position?: string
}
export type SpaceSectorAttributes = keyof SpaceSector

export const SPACE_SECTOR_ATTRIBUTES: SpaceSectorAttributes[] = (['uuid', 'entityType', 'name', 'position'] as const) satisfies SpaceSectorAttributes[]

export const SPACE_SECTOR_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(SPACE_SECTOR_ATTRIBUTES)

export function isSpaceSector(value: unknown): value is SpaceSector {
  return ((value as SpaceSector)?.entityType === ENTITY_TYPE_SPACE_SECTOR)
}
