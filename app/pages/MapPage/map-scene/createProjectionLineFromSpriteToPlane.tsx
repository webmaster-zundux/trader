import { BufferGeometry, Line, LineBasicMaterial, Quaternion, Vector3, type Group, type NormalBufferAttributes, type Object3DEventMap, type Sprite } from 'three'
import { COLOR_THEME_DARK, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import { SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_DARK_THEME, SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_LIGHT_THEME, SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_SIZE_AT_POINT_ON_PLANE } from '../Map.const'
import type { MapPlaneHelper } from './MapPlaneHelper'
import { createTwoCrossedLines } from './createTwoCrossedLines'

function addCross(
  planeHelper: MapPlaneHelper,
  projectionPointToPlaneLine: Line<BufferGeometry<NormalBufferAttributes>, LineBasicMaterial, Object3DEventMap>,
  pointOnPlane: Vector3,
  colorTheme: PreferedColorTheme
) {
  const planeRotationQuaternion = new Quaternion()

  planeHelper.getWorldQuaternion(planeRotationQuaternion)
  createTwoCrossedLines({
    group: projectionPointToPlaneLine,
    parentQuaternion: planeRotationQuaternion,
    position: pointOnPlane,
    size: SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_SIZE_AT_POINT_ON_PLANE,
    colorTheme
  })
}

export function createProjectionLineFromSpriteToPlane(
  sprite: Sprite,
  planeHelper: MapPlaneHelper,
  spritesProjectionLinesGroup: Group,
  colorTheme: PreferedColorTheme
) {
  const spritePosition = sprite.getWorldPosition(new Vector3())
  const pointOnPlane = new Vector3()

  planeHelper.plane.projectPoint(spritePosition, pointOnPlane)

  const points = [spritePosition, pointOnPlane]
  const lineGeometry = new BufferGeometry().setFromPoints(points)

  const materialColor = colorTheme === COLOR_THEME_DARK
    ? SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_DARK_THEME
    : SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_LIGHT_THEME

  const material = new LineBasicMaterial({ color: materialColor, toneMapped: false })
  const projectionPointToPlaneLine = new Line(lineGeometry, material)

  addCross(planeHelper, projectionPointToPlaneLine, pointOnPlane, colorTheme)

  projectionPointToPlaneLine.addEventListener('removed', function onRemoved() {
    projectionPointToPlaneLine.clear()
    projectionPointToPlaneLine.material.dispose()
    projectionPointToPlaneLine.geometry.dispose()
  })

  spritesProjectionLinesGroup.add(projectionPointToPlaneLine)

  return projectionPointToPlaneLine
}
