import { memo, useMemo, type RefObject } from 'react'
import { NavLink } from 'react-router'
import { Button } from '~/components/Button'
import { ChevronRightIcon } from '~/components/icons/ChevronRightIcon'
import { Graph3Icon } from '~/components/icons/GraphIcon'
import { LocationOnIcon } from '~/components/icons/LocationOnIcon'
import { PlanetOrbitIcon } from '~/components/icons/PlanetOrbitIcon'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { createNameFromParts, FULL_NAME_PART_SEPARATOR } from '~/models/utils/createNameFromParts'
import { PAGE_SLUG_MAP } from '~/router/PageSlugs.const'
import { getLocationByUuidSelector } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityByUuidSelector } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'
import { cn } from '~/utils/ui/ClassNames'
import { MAP_MODE_UNIVERSE, type MapMode } from './Map.const'
import styles from './MapStaticOverlay.module.css'

interface MapStaticOverlayProps {
  selectedPlanetarySystemUuid?: PlanetarySystem['uuid']
  selectedMovingEntityUuid?: MovingEntity['uuid']
  selectedLocationUuid?: Location['uuid']
  mapZoomLevelLabelRef: RefObject<HTMLDivElement | null>
  mapMode: MapMode
}
export const MapStaticOverlay = memo(function MapStaticOverlay({
  selectedPlanetarySystemUuid,
  selectedMovingEntityUuid,
  selectedLocationUuid,
  mapZoomLevelLabelRef,
  mapMode,
}: MapStaticOverlayProps) {
  const selectedPlanetarySystemName = useMemo(function selectedPlanetarySystemNameMemo() {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    return selectedPlanetarySystemUuid && getPlanetarySystemByUuidSelector(selectedPlanetarySystemUuid)?.name
  }, [selectedPlanetarySystemUuid, mapMode])

  const selectedMovingEntityIdWithName = useMemo(function selectedMovingEntityName() {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    const movingEntity = selectedMovingEntityUuid && getMovingEntityByUuidSelector(selectedMovingEntityUuid)

    if (!movingEntity) {
      return undefined
    }

    return createNameFromParts([
      movingEntity.id,
      movingEntity.name,
    ], false, FULL_NAME_PART_SEPARATOR)
  }, [selectedMovingEntityUuid, mapMode])

  const selectedLocationIdWithName = useMemo(function selectedLocationName() {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    const location = selectedLocationUuid && getLocationByUuidSelector(selectedLocationUuid)

    if (!location) {
      return undefined
    }

    return createNameFromParts([
      location.id,
      location.name,
    ], false, FULL_NAME_PART_SEPARATOR)
  }, [selectedLocationUuid, mapMode])

  return (
    <div className={styles.MapStaticOverlayContainer}>
      <div className={styles.LabelsContainer}>

        <div className={styles.PlaceLabelsContainer}>
          {!selectedPlanetarySystemName && (
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
                  {/* <div className={styles.PlanetarySystemNameSubLabel}>
                    (planetary system)
                  </div> */}
                </div>
              </div>
            </>
          )}
        </div>

        {selectedMovingEntityIdWithName && (
          <div className={styles.SelectedItemLabelsContainer}>
            <div className={styles.IconAndLabelContainerWrapper}>
              <LocationOnIcon className={cn([styles.LabelIcon, styles.Small])} />

              <div className={styles.LabelContainer}>
                <div className={styles.PlanetarySystemNameLabel}>
                  {selectedMovingEntityIdWithName}
                </div>
                {/* <div className={styles.PlanetarySystemNameSubLabel}>
                  (moving object)
                </div> */}
              </div>
            </div>
          </div>
        )}

        {selectedLocationIdWithName && (
          <div className={styles.SelectedItemLabelsContainer}>
            <div className={styles.IconAndLabelContainerWrapper}>
              <LocationOnIcon className={cn([styles.LabelIcon, styles.Small])} />

              <div className={styles.LabelContainer}>
                <div className={styles.PlanetarySystemNameLabel}>
                  {selectedLocationIdWithName}
                </div>
                {/* <div className={styles.PlanetarySystemNameSubLabel}>
                  (location)
                </div> */}
              </div>
            </div>
          </div>
        )}

      </div>

      <div ref={mapZoomLevelLabelRef} className={styles.MapZoomLevelLabel}></div>
    </div>
  )
})
