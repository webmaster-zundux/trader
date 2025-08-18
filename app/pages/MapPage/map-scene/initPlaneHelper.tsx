import type { ColorRepresentation, Scene, Vector3 } from 'three'
import { Plane } from 'three'
import { COLOR_THEME_DARK, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import { SCENE_PLANE_HELPER_COLOR_DARK_THEME, SCENE_PLANE_HELPER_COLOR_LIGHT_THEME, SCENE_PLANE_HELPER_OPACITY, SCENE_PLANE_NORMAL } from '../Map.const'
import { MapPlaneHelper } from './MapPlaneHelper'

export function initPlaneHelper({
  scene,
  normal = SCENE_PLANE_NORMAL,
  constant = 0,
  size = 1,
  colorTheme,
  color,
  opacity = SCENE_PLANE_HELPER_OPACITY,
}: {
  scene: Scene
  normal?: Vector3
  constant?: number
  size?: number
  color?: ColorRepresentation
  opacity?: number
  colorTheme: PreferedColorTheme
}) {
  const materialColor = color
    ? color
    : (
        colorTheme === COLOR_THEME_DARK
          ? SCENE_PLANE_HELPER_COLOR_DARK_THEME
          : SCENE_PLANE_HELPER_COLOR_LIGHT_THEME
      )

  const plane = new Plane(normal, constant)
  const planeHelper = new MapPlaneHelper(plane, size, materialColor, opacity)

  planeHelper.addEventListener('removed', function onRemoved() {
    planeHelper.dispose()
  })

  scene.add(planeHelper)

  return planeHelper
}
