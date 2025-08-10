import { Color, type ColorRepresentation, Group, Scene } from 'three'
import type { PreferedColorTheme } from '~/components/PreferedColorThemeSwitch'
import { CANVAS_BACKGROUND_COLOR_DARK_THEME, CANVAS_BACKGROUND_COLOR_LIGHT_THEME } from '../Map.const'

export function initScene(overrideColorTheme: PreferedColorTheme) {
  const backgroundColor: ColorRepresentation = overrideColorTheme === 'dark'
    ? CANVAS_BACKGROUND_COLOR_DARK_THEME
    : CANVAS_BACKGROUND_COLOR_LIGHT_THEME

  const scene = new Scene()

  scene.background = new Color(backgroundColor)

  return scene
}

export function initSpritesGroup(scene: Scene) {
  const spritesGroup = new Group()

  scene.add(spritesGroup)
  spritesGroup.renderOrder = +Infinity

  return spritesGroup
}

export function initSpritesProjectionLinesGroup(scene: Scene) {
  const spritesProjectionLinesGroup = new Group()

  scene.add(spritesProjectionLinesGroup)

  return spritesProjectionLinesGroup
}
