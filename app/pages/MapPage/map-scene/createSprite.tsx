import { type Sprite, Vector3 } from 'three'
import type { PreferedColorTheme } from '~/components/PreferedColorThemeSwitch'
import { type Location, isLocation } from '~/models/entities/Location'
import { type MovingEntity, isMovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem, isPlanetarySystem } from '~/models/entities/PlanetarySystem'
import { parsePositionFromString } from '~/models/Position'
import { getLocationTypeByUuidSelector } from '~/stores/entity-stores/LocationTypes.store'
import { getMovingEntityClassByUuidSelector } from '~/stores/entity-stores/MovingEntityClasses.store'
import { createTexturePath } from '~/utils/createTexturePath'
import { MAP_TEXTURE_NAMES, QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90, SPRITE_COLOR_DARK_THEME, SPRITE_COLOR_LIGHT_THEME, SPRITE_SIZES_FOR_LOCATION_BY_TYPE } from '../Map.const'
import { createSquareSpriteWithTexture } from './createSquareSpriteWithTexture'

const POSITION_SCALAR_FOR_LOCATION = 1 / 1_000_000
const POSITION_SCALAR_FOR_MOVING_ENTITY = 1 / 1_000_000

export function createSprite(
  item: PlanetarySystem | Location | MovingEntity,
  colorTheme: PreferedColorTheme
): Sprite | undefined {
  const position = createPositionFromItemPositionString(item.position)

  if (!position) {
    return undefined
  }

  const materialColor = colorTheme === 'light'
    ? SPRITE_COLOR_LIGHT_THEME
    : SPRITE_COLOR_DARK_THEME

  let sprite: Sprite | undefined = undefined

  if (isLocation(item)) {
    position.multiplyScalar(POSITION_SCALAR_FOR_LOCATION)
    position.applyQuaternion(QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90)

    const locationTypeImage = item.locationTypeUuid ? getLocationTypeByUuidSelector(item.locationTypeUuid)?.image : undefined

    sprite = createSquareSpriteWithTexture({
      name: item.uuid,
      textureAsString: locationTypeImage || createTexturePath(MAP_TEXTURE_NAMES.structureUnknown),
      position,
      materialColor,
    })

    const scaleModificator = getSpriteSizeForLocationByType(item, 0.25)

    sprite.scale.set(scaleModificator, scaleModificator, scaleModificator)
  } else if (isMovingEntity(item)) {
    position.multiplyScalar(POSITION_SCALAR_FOR_MOVING_ENTITY)
    position.applyQuaternion(QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90)

    const movingEntityClassImage = item.movingEntityClassUuid ? getMovingEntityClassByUuidSelector(item.movingEntityClassUuid)?.image : undefined

    sprite = createSquareSpriteWithTexture({
      name: item.uuid,
      textureAsString: movingEntityClassImage || createTexturePath(MAP_TEXTURE_NAMES.shipUnknown),
      position,
      materialColor,
    })

    sprite.scale.set(0.35, 0.35, 0.35)
  } else if (isPlanetarySystem(item)) {
    sprite = createSquareSpriteWithTexture({
      name: item.uuid,
      textureAsString: createTexturePath(MAP_TEXTURE_NAMES.circle),
      position,
      materialColor,
    })

    sprite.scale.set(0.1, 0.1, 0.1)
  } else {
    return undefined
  }

  sprite.userData.item = item

  return sprite
}

export function getSpriteSizeForLocationByType(
  location: Location,
  defaultSize: number = 1.0
): number {
  const locationTypeUuid = location.locationTypeUuid
  const locationTypeName = locationTypeUuid ? getLocationTypeByUuidSelector(locationTypeUuid)?.name : undefined

  if (!locationTypeName) {
    return defaultSize
  }

  return SPRITE_SIZES_FOR_LOCATION_BY_TYPE[locationTypeName] || defaultSize
}

export function createPositionFromItemPositionString(
  positionAsString: unknown
): Vector3 | undefined {
  const positionData = parsePositionFromString(positionAsString)

  if (!positionData) {
    return undefined
  }

  const position = new Vector3()

  position.fromArray(positionData)

  return position
}
