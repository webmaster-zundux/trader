import { memo, type RefObject } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import styles from './MapDynamicOverlay.module.css'
import { SpriteLabelGroup } from './SpriteLabelGroup'
import { MAP_MODE_PLANETARY_SYSTEM, MAP_MODE_UNIVERSE, type MapMode } from './Map.const'
import { SpriteHighlightGroup } from './SpriteHighlightGroup'

interface MapDynamicOverlayProps {
  ref: RefObject<HTMLDivElement | null>
  items: (MovingEntity | Location | PlanetarySystem)[]
  mapMode: MapMode
}
export const MapDynamicOverlay = memo(function MapDynamicOverlay({
  ref,
  items,
  mapMode,
}: MapDynamicOverlayProps) {
  return (
    <div ref={ref} className={styles.MapDynamicOverlayContainer}>
      {(mapMode === MAP_MODE_UNIVERSE) && (
        <SpriteLabelGroup items={items} />
      )}

      {(mapMode === MAP_MODE_PLANETARY_SYSTEM) && (
        <SpriteHighlightGroup items={items} />
      )}
    </div>
  )
})
