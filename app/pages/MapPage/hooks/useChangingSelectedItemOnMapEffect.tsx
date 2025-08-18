import { useEffect, type RefObject } from 'react'
import type { Group } from 'three'
import { type Object3DEventMap } from 'three'
import { COLOR_THEME_DARK, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { isCSS2DObjectForReactComponent } from '../map-scene/CSS2DObjectForReactComponent'
import { isSprite } from '../map-scene/isSprite'
import { MAP_MODE_PLANETARY_SYSTEM, SPRITE_COLOR_DARK_THEME, SPRITE_COLOR_LIGHT_THEME, SPRITE_COLOR_SELECTED_COLOR_DARK_THEME, SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME, type MapMode } from '../Map.const'

export function useChangingSelectedItemOnMapEffect({
  selectedItemUuid,
  spritesGroupRef,
  items,
  colorTheme,
  mode,
  renderFrame,
}: {
  selectedItemUuid?: (MovingEntity | Location | PlanetarySystem)['uuid']
  spritesGroupRef: RefObject<Group<Object3DEventMap> | null>
  items: (MovingEntity | Location | PlanetarySystem)[]
  colorTheme: PreferedColorTheme
  mode: MapMode
  renderFrame: () => void
}) {
  useEffect(function changingSelectedItemOnMapEffect() {
    if (!items.length) {
      return
    }

    const spritesGroup = spritesGroupRef.current

    if (!spritesGroup) {
      return
    }

    spritesGroup.children.forEach((child) => {
      if (isSprite(child)) {
        const sprite = child

        if (sprite.userData.item?.uuid === selectedItemUuid) {
          const color = colorTheme === COLOR_THEME_DARK
            ? SPRITE_COLOR_SELECTED_COLOR_DARK_THEME
            : SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME

          sprite.material.color.set(color)

          if (mode === MAP_MODE_PLANETARY_SYSTEM) {
            const spriteLabel = sprite.children.find(child => isCSS2DObjectForReactComponent(child))

            if (spriteLabel) {
              spriteLabel.visible = true
            }
          }
        } else {
          const color = colorTheme === COLOR_THEME_DARK
            ? SPRITE_COLOR_DARK_THEME
            : SPRITE_COLOR_LIGHT_THEME

          sprite.material.color.set(color)

          if (mode === MAP_MODE_PLANETARY_SYSTEM) {
            const spriteLabel = sprite.children.find(child => isCSS2DObjectForReactComponent(child))

            if (spriteLabel) {
              spriteLabel.visible = false
            }
          }
        }
      }
    })

    renderFrame()
  }, [items, spritesGroupRef, renderFrame, selectedItemUuid, colorTheme, mode])
}
