import { memo, useCallback } from 'react'
import { useHtmlElementResize } from '~/hooks/ui/useHtmlElementResize'
import { type Location } from '~/models/entities/Location'
import { type MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { useMapRenderer } from './hooks/useMapRenderer'
import { type MapMode } from './Map.const'
import styles from './Map.module.css'
import { MapDynamicOverlay } from './MapDynamicOverlay'
import { MapStaticOverlay } from './MapStaticOverlay'

interface MapProps {
  isLoading?: boolean
  items?: (MovingEntity | Location | PlanetarySystem)[]
  mapMode: MapMode
  selectedPlanetarySystemUuid?: PlanetarySystem['uuid']
  onSelectItem: (item: MovingEntity | Location | PlanetarySystem) => void
  selectedItemUuid?: (MovingEntity | Location | PlanetarySystem)['uuid']
}
export const Map = memo(function Map({
  isLoading = false,
  items = [],
  mapMode,
  selectedPlanetarySystemUuid,
  onSelectItem,
  selectedItemUuid,
}: MapProps) {
  const {
    mapCanvasRef,
    mapOverlayContainerRef,
    mapZoomLevelLabelRef,
    pointerDotRef,
    noDataToDisplay,
    renderFrame,
    onWindowResize,
  } = useMapRenderer({
    mode: mapMode,
    items,
    onSelectItem,
    selectedItemUuid,
  })

  const handleCanvasResize = useCallback(function handleCanvasResize() {
    onWindowResize()
    renderFrame()
  }, [onWindowResize, renderFrame])

  useHtmlElementResize(mapCanvasRef, handleCanvasResize)

  return (
    <>
      <div className={styles.CanvasContainer}>
        <canvas ref={mapCanvasRef}></canvas>

        <MapDynamicOverlay
          ref={mapOverlayContainerRef}
          items={items}
        />

        <MapStaticOverlay
          mapZoomLevelLabelRef={mapZoomLevelLabelRef}
          selectedPlanetarySystemUuid={selectedPlanetarySystemUuid}
          mapMode={mapMode}
        />

        <div ref={pointerDotRef} className={styles.PointerDot}></div>
      </div>

      {isLoading && (
        <div className={styles.MapStatusLabel}>
          data loading...
        </div>
      )}

      {!isLoading && noDataToDisplay && (
        <div className={styles.MapStatusLabel}>
          no data available
        </div>
      )}
    </>
  )
})
