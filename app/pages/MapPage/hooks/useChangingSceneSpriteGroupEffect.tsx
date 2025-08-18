import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'
import type { Group, Scene } from 'three'
import { type Object3DEventMap } from 'three'
import type { PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { calculateBoundingBoxByPositions } from '../map-scene/calculateBoundingBoxByPositions'
import { createProjectionLineFromSpriteToPlane } from '../map-scene/createProjectionLineFromSpriteToPlane'
import { createSprite } from '../map-scene/createSprite'
import { createSpriteLabelAnchor } from '../map-scene/createSpriteLabelAnchor'
import type { MapPlaneHelper } from '../map-scene/MapPlaneHelper'
import { MAP_MODE_PLANETARY_SYSTEM, MAP_MODE_UNIVERSE, SCENE_PLANE_HELPER_PADDING_IN_SCENE_COORDINATE_SYSTEM, type MapMode } from '../Map.const'

export function useChangingSceneSpriteGroupEffect({
  spritesGroupRef,
  spritesProjectionLinesGroupRef,
  sceneRef,
  planeHelperRef,
  mapOverlayContainerRef,
  items,
  colorTheme,
  mode,
  setNoDataToDisplay,
  resetCamera,
  renderFrame,
}: {
  spritesGroupRef: RefObject<Group<Object3DEventMap> | null>
  spritesProjectionLinesGroupRef: RefObject<Group<Object3DEventMap> | null>
  sceneRef: RefObject<Scene | null>
  planeHelperRef: RefObject<MapPlaneHelper | null>
  mapOverlayContainerRef: RefObject<HTMLDivElement | null>
  items: (MovingEntity | Location | PlanetarySystem)[]
  colorTheme: PreferedColorTheme
  mode: MapMode
  setNoDataToDisplay: Dispatch<SetStateAction<boolean>>
  resetCamera: (mode: MapMode, isNoVisibleItems: boolean) => void
  renderFrame: () => void
}) {
  useEffect(function initSceneSpriteGroupItemsEffect() {
    const spritesGroup = spritesGroupRef.current

    if (!spritesGroup) {
      return
    }

    const spritesProjectionLinesGroup = spritesProjectionLinesGroupRef.current

    if (!spritesProjectionLinesGroup) {
      return
    }

    const scene = sceneRef.current

    if (!scene) {
      return
    }

    const planeHelper = planeHelperRef.current

    if (!planeHelper) {
      return
    }

    const mapOverlayElement = mapOverlayContainerRef.current

    if (!mapOverlayElement) {
      return
    }

    spritesGroup.clear()
    spritesProjectionLinesGroup.clear()

    items.forEach((item) => {
      const sprite = createSprite(item, colorTheme)

      if (!sprite) {
        return
      }

      if (mode === MAP_MODE_PLANETARY_SYSTEM) {
        createProjectionLineFromSpriteToPlane(sprite, planeHelper, spritesProjectionLinesGroup, colorTheme)
      }

      if (mode === MAP_MODE_PLANETARY_SYSTEM) {
        createSpriteLabelAnchor(item, sprite, mapOverlayElement, false)
      } else {
        createSpriteLabelAnchor(item, sprite, mapOverlayElement, true)
      }

      spritesGroup.add(sprite)
    })

    const isNoVisibleItems = !(spritesGroup.children.length)

    if (isNoVisibleItems) {
      planeHelper.visible = false
    } else {
      if (mode === MAP_MODE_UNIVERSE) {
        planeHelper.visible = false
      } else if (mode === MAP_MODE_PLANETARY_SYSTEM) {
        planeHelper.visible = true

        const boundingBox = calculateBoundingBoxByPositions(spritesGroup)
        const maxCoordinate = Math.max.apply(undefined, new Array<number>().concat(boundingBox.min.toArray(), boundingBox.max.toArray()).map(Math.abs))
        const size = (maxCoordinate * (1 + SCENE_PLANE_HELPER_PADDING_IN_SCENE_COORDINATE_SYSTEM)) * 2

        planeHelper.setSize(size)
      }
    }

    setNoDataToDisplay(isNoVisibleItems)
    resetCamera(mode, isNoVisibleItems)
    renderFrame()
  }, [items, sceneRef, spritesGroupRef, spritesProjectionLinesGroupRef, planeHelperRef, mapOverlayContainerRef, setNoDataToDisplay, renderFrame, resetCamera, mode, colorTheme])
}
