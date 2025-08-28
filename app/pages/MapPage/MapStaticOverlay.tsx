import { memo, useMemo, type RefObject } from 'react'
import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { parsePositionFromString } from '~/models/Position'
import { createNameFromParts, FULL_NAME_PART_SEPARATOR } from '~/models/utils/createNameFromParts'
import { PAGE_SLUG_MAP } from '~/routes'
import { getLocationByUuidSelector } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityByUuidSelector } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'
import { cn } from '~/utils/ui/ClassNames'
import { MAP_MODE_UNIVERSE, type MapMode } from './Map.const'
import styles from './MapStaticOverlay.module.css'
import { MapStaticOverlayActionButtons } from './MapStaticOverlayActionButtons'

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

  const selectedMovingEntity = useMemo(() => selectedMovingEntityUuid && getMovingEntityByUuidSelector(selectedMovingEntityUuid), [selectedMovingEntityUuid])
  const selectedMovingEntityPosition = useMemo(() => selectedMovingEntity && parsePositionFromString(selectedMovingEntity.position), [selectedMovingEntity])
  const selectedMovingEntityIdWithName = useMemo(function selectedMovingEntityName(): string | undefined {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    if (!selectedMovingEntity) {
      return undefined
    }

    if (!selectedMovingEntity.id && !selectedMovingEntity.name) {
      return '(no data)'
    }

    return createNameFromParts([
      selectedMovingEntity.id,
      selectedMovingEntity.name,
    ], false, FULL_NAME_PART_SEPARATOR)
  }, [mapMode, selectedMovingEntity])

  const selectedLocation = useMemo(() => selectedLocationUuid && getLocationByUuidSelector(selectedLocationUuid), [selectedLocationUuid])
  const selectedLocationPosition = useMemo(() => selectedLocation && parsePositionFromString(selectedLocation.position), [selectedLocation])
  const selectedLocationIdWithName = useMemo(function selectedLocationName(): string | undefined {
    if (mapMode === MAP_MODE_UNIVERSE) {
      return undefined
    }

    if (!selectedLocation) {
      return undefined
    }

    if (!selectedLocation.id && !selectedLocation.name) {
      return '(no data)'
    }

    return createNameFromParts([
      selectedLocation.id,
      selectedLocation.name,
    ], false, FULL_NAME_PART_SEPARATOR)
  }, [mapMode, selectedLocation])

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
                disabled
                asInitial
              >
                <Icon name="graph_3" />
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
                <InternalStaticLink
                  to={PAGE_SLUG_MAP}
                  title="global map"
                >
                  <Icon name="graph_3" />
                </InternalStaticLink>
              </div>

              <div className={styles.LevelIndicationIconWrapper}>
                <Button
                  noPadding
                  noBorder
                  transparent
                  disabled
                >
                  <Icon name="chevron_right" />
                </Button>
              </div>

              <div className={styles.IconAndLabelContainerWrapper}>
                <Icon name="planet_orbit" className={styles.LabelIcon} />

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
              {selectedMovingEntityPosition && (
                <Icon name="location_on" className={cn([styles.LabelIcon, styles.Small])} />
              )}
              {!selectedMovingEntityPosition && (
                <Icon name="not_listed_location" className={cn([styles.LabelIcon, styles.Small])} />
              )}

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
              {selectedLocationPosition && (
                <Icon name="location_on" className={cn([styles.LabelIcon, styles.Small])} />
              )}
              {!selectedLocationPosition && (
                <Icon name="not_listed_location" className={cn([styles.LabelIcon, styles.Small])} />
              )}

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

        <MapStaticOverlayActionButtons
          mapMode={mapMode}
        />
      </div>

      <div ref={mapZoomLevelLabelRef} className={styles.MapZoomLevelLabel}></div>
    </div>
  )
})
