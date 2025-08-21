import { Button } from '~/components/Button'
import { InfoIcon } from '~/components/icons/InfoIcon'
import { LocationOnIcon } from '~/components/icons/LocationOnIcon'
import { NotListedLocation } from '~/components/icons/NotListedLocationIcon'
import { PlanetOrbitIcon } from '~/components/icons/PlanetOrbitIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { type Column, NoDataCell } from '~/components/Table'
import { type Location, isLocation } from '~/models/entities/Location'
import { type MovingEntity, isMovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem, isPlanetarySystem } from '~/models/entities/PlanetarySystem'
import { isUuid } from '~/models/Entity'
import { parsePositionFromString } from '~/models/Position'
import { createNameFromParts } from '~/models/utils/createNameFromParts'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getUrlToMovingEntitiesPageWithParams } from '~/router/urlSearchParams/getUrlToMovingEntitiesPageWithParams'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityByUuidSelector, useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { MAP_MODE_UNIVERSE } from './Map.const'
import styles from './MapPage.module.css'

function getPlanetarySystemForSearchResult(item: Location | PlanetarySystem | MovingEntity): PlanetarySystem | undefined {
  let planetarySystem: PlanetarySystem | undefined = undefined

  if (isPlanetarySystem(item)) {
    planetarySystem = item
  } else if (isLocation(item)) {
    planetarySystem = (
      !!(item.planetarySystemUuid)
      && getPlanetarySystemByUuidSelector(item.planetarySystemUuid)
    ) || undefined
  } else if (isMovingEntity(item)) {
    const location = (
      !!item.locationUuid
      && getLocationByUuidSelector(item.locationUuid)
    ) || undefined

    if (location) {
      planetarySystem = (
        !!(location?.planetarySystemUuid)
        && getPlanetarySystemByUuidSelector(location.planetarySystemUuid)
      ) || undefined
    } else {
      planetarySystem = (
        !!item.locationUuid
        && getPlanetarySystemByUuidSelector(item.locationUuid)
      ) || undefined
    }
  }

  return planetarySystem
}

export function getSearchResultTableColumns(): Column<Location | PlanetarySystem | MovingEntity>[] {
  return [
    {
      name: 'name',
      asLinkToSelectItem: true,
      alignLabel: 'left',
      formatValue: function FormattedNameForSearchResult({ item }) {
        const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore, useLocationsStore, useMovingEntitiesStore])

        const planetarySystem = isLoading ? undefined : getPlanetarySystemForSearchResult(item)

        const name = (isLocation(item) || isMovingEntity(item))
          ? createNameFromParts([item.id, item.name, planetarySystem?.name])
          : (item.name)

        return (
          <>
            {(typeof name === 'string') ? (
              <div className={styles.SearchResultName}>
                {isMovingEntity(item) && (
                  <>
                    <LocationOnIcon />
                    {' '}
                  </>
                )}
                {isLocation(item) && (
                  <>
                    <LocationOnIcon />
                    {' '}
                  </>
                )}
                {isPlanetarySystem(item) && (
                  <>
                    <PlanetOrbitIcon />
                    {' '}
                  </>
                )}
                {name}
              </div>
            ) : (
              <NoDataCell>
                (no&nbsp;data)
              </NoDataCell>
            )}
          </>
        )
      },
      actionButtons: function SearchResultNameActionButtonsForSearchResult({ item }) {
        const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore, useLocationsStore, useMovingEntitiesStore])

        const planetarySystem = isLoading ? undefined : getPlanetarySystemForSearchResult(item)

        const movingEntity = (isMovingEntity(item)
          && (isLoading || !isUuid(item.uuid))
          ? undefined
          : getMovingEntityByUuidSelector(item.uuid)
        )

        const urlToMovingEntitiesPage = getUrlToMovingEntitiesPageWithParams({
          movingEntityName: movingEntity?.id || movingEntity?.name,
          // planetarySystemName: planetarySystem?.name,
        })

        const location = (isLocation(item)
          && (isLoading || !isUuid(item.uuid))
          ? undefined
          : getLocationByUuidSelector(item.uuid)
        )

        const urlToLocationsPageForLocation = location && getUrlToLocationsPageWithParams({
          locationName: location?.id || location?.name,
          planetarySystemName: planetarySystem?.name,
        })

        const urlToLocationsPageForPlanetarySystem = planetarySystem && getUrlToLocationsPageWithParams({
          planetarySystemName: planetarySystem?.name,
        })

        const position = parsePositionFromString(item.position)

        const urlToMapPageWithPlanetarySystemModeForMovingEntity = movingEntity && position && getUrlToMapPageWithParams({
          planetarySystemName: planetarySystem?.name,
          movingEntityId: movingEntity.id,
          movingEntityName: movingEntity.name
        })

        const urlToMapPageWithPlanetarySystemModeForLocation = location && position && getUrlToMapPageWithParams({
          planetarySystemName: planetarySystem?.name,
          locationId: location.id,
          locationName: location.name
        })

        const urlToMapPageWithUniverseMode = planetarySystem && position && getUrlToMapPageWithParams({
          planetarySystemName: planetarySystem?.name,
          mapMode: MAP_MODE_UNIVERSE
        })

        return (
          <>
            {isMovingEntity(item) && (
              <>
                {urlToMapPageWithPlanetarySystemModeForMovingEntity ? (
                  <InternalStaticLink to={urlToMapPageWithPlanetarySystemModeForMovingEntity} title="show moving object on map">
                    <LocationOnIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no position data">
                    <NotListedLocation />
                  </Button>
                )}

                {urlToMovingEntitiesPage ? (
                  <InternalStaticLink to={urlToMovingEntitiesPage} title="show moving object info">
                    <InfoIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no moving object data">
                    <SearchOffIcon />
                  </Button>
                )}
              </>
            )}

            {isLocation(item) && (
              <>
                {urlToMapPageWithPlanetarySystemModeForLocation ? (
                  <InternalStaticLink to={urlToMapPageWithPlanetarySystemModeForLocation} title="show location on map">
                    <LocationOnIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no position data">
                    <NotListedLocation />
                  </Button>
                )}

                {urlToLocationsPageForLocation ? (
                  <InternalStaticLink to={urlToLocationsPageForLocation} title="show location info">
                    <InfoIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no location data">
                    <SearchOffIcon />
                  </Button>
                )}
              </>
            )}

            {isPlanetarySystem(item) && (
              <>
                {urlToMapPageWithUniverseMode ? (
                  <InternalStaticLink to={urlToMapPageWithUniverseMode} title="show planetary system on map">
                    <LocationOnIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no position data">
                    <NotListedLocation />
                  </Button>
                )}

                {urlToLocationsPageForPlanetarySystem ? (
                  <InternalStaticLink to={urlToLocationsPageForPlanetarySystem} title="show planetary system info">
                    <InfoIcon />
                  </InternalStaticLink>
                ) : (
                  <Button disabled noBorder noPadding transparent title="no planetary system data">
                    <SearchOffIcon />
                  </Button>
                )}
              </>
            )}
          </>
        )
      },
    },
  ]
}
