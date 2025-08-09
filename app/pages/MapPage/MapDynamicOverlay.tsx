import { memo, type RefObject } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import styles from './MapDynamicOverlay.module.css'
import { SpriteLabelGroup } from './SpriteLabelGroup'

interface MapDynamicOverlayProps {
  ref: RefObject<HTMLDivElement | null>
  items: (MovingEntity | Location | PlanetarySystem)[]
}
export const MapDynamicOverlay = memo(function MapDynamicOverlay({
  items,
  ref,
}: MapDynamicOverlayProps) {
  return (
    <div ref={ref} className={styles.MapDynamicOverlayContainer}>
      <SpriteLabelGroup items={items} />
    </div>
  )
})
