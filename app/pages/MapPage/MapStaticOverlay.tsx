import { memo, useMemo, type RefObject } from 'react'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'
import { MAP_MODE_UNIVERSE, type MapMode } from './Map.const'
import styles from './MapStaticOverlay.module.css'

interface MapStaticOverlayProps {
  selectedPlanetarySystemUuid?: PlanetarySystem['uuid']
  mapZoomLevelLabelRef: RefObject<HTMLDivElement | null>
  mapMode: MapMode
}
export const MapStaticOverlay = memo(function MapStaticOverlay({
  selectedPlanetarySystemUuid,
  mapZoomLevelLabelRef,
  mapMode,
}: MapStaticOverlayProps) {
  const selectedPlanetarySystemName = useMemo(function selectedPlanetarySystemNameMemo() {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    return selectedPlanetarySystemUuid && getPlanetarySystemByUuidSelector(selectedPlanetarySystemUuid)?.name
  }, [selectedPlanetarySystemUuid, mapMode])

  return (
    <div className={styles.MapStaticOverlayContainer}>
      {selectedPlanetarySystemName && (
        <div className={styles.PlanetarySystemNameLabelContainer}>
          <div className={styles.PlanetarySystemNameLabel}>
            {selectedPlanetarySystemName}
          </div>
          <div className={styles.PlanetarySystemNameSubLabel}>
            planetary system
          </div>
        </div>
      )}

      <div ref={mapZoomLevelLabelRef} className={styles.MapZoomLevelLabel}></div>
    </div>
  )
})
