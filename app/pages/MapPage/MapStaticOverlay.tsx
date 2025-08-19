import { memo, useMemo, type RefObject } from 'react'
import { NavLink } from 'react-router'
import { Button } from '~/components/Button'
import { ChevronRightIcon } from '~/components/icons/ChevronRightIcon'
import { Graph3Icon } from '~/components/icons/GraphIcon'
import { PlanetOrbitIcon } from '~/components/icons/PlanetOrbitIcon'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { PAGE_SLUG_MAP } from '~/router/PageSlugs.const'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'
import { cn } from '~/utils/ui/ClassNames'
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
      <div className={styles.LabelsContainer}>

        <div className={styles.PlaceLabelsContainer}>

          {mapMode === MAP_MODE_UNIVERSE && (
            <div className={styles.IconAndLabelContainerWrapper}>
              <Button
                noPadding
                noBorder
                transparent
              >
                <Graph3Icon />
              </Button>

              <div className={styles.LabelContainer}>
                <div className={styles.PlanetarySystemNameLabel}>
                  Universe
                </div>
                <div className={styles.PlanetarySystemNameSubLabel}>
                  (global map)
                </div>
              </div>
            </div>
          )}

          {selectedPlanetarySystemName && (
            <>
              <div className={cn([
                styles.LabelContainer,
                styles.IconWrapper,
              ])}
              >
                <NavLink to={`/${PAGE_SLUG_MAP}`}>
                  <Button
                    noPadding
                    noBorder
                    transparent
                    title="universe map"
                  >
                    <Graph3Icon />
                  </Button>
                </NavLink>
              </div>

              <div className={styles.LevelIndicationIconWrapper}>
                <Button
                  noPadding
                  noBorder
                  transparent
                  disabled
                >
                  <ChevronRightIcon />
                </Button>
              </div>

              <div className={styles.IconAndLabelContainerWrapper}>
                <PlanetOrbitIcon className={styles.LabelIcon} />

                <div className={styles.LabelContainer}>
                  <div className={styles.PlanetarySystemNameLabel}>
                    {selectedPlanetarySystemName}
                  </div>
                  <div className={styles.PlanetarySystemNameSubLabel}>
                    (planetary system)
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

      </div>

      <div ref={mapZoomLevelLabelRef} className={styles.MapZoomLevelLabel}></div>
    </div>
  )
})
