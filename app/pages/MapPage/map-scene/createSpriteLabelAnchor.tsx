import type { Sprite } from 'three'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { CSS2DObjectForReactComponent } from './CSS2DObjectForReactComponent'
import { findLabelAnchorHtmlElement } from './findLabelAnchorHtmlElement'

export function createSpriteLabelAnchor(
  item: PlanetarySystem | Location | MovingEntity,
  sprite: Sprite,
  mapOverlayElement: HTMLDivElement,
  isVisible: boolean = false
) {
  const labelAnchorHtmlElement = findLabelAnchorHtmlElement(item.uuid, mapOverlayElement)

  if (!labelAnchorHtmlElement) {
    return undefined
  }

  const spriteLabelAnchor = new CSS2DObjectForReactComponent(labelAnchorHtmlElement)

  spriteLabelAnchor.position.set(0, 0, 0)
  spriteLabelAnchor.visible = isVisible
  sprite.add(spriteLabelAnchor)
}
