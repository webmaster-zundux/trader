import { isUuid } from '~/models/Entity'
import { parsePositionFromString } from '~/models/Position'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Button } from '../../components/Button'
import { InternalStaticLink } from '../../components/InternalStaticLink'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '../../stores/entity-stores/PlanetarySystems.store'
import { MAP_MODE_UNIVERSE } from '../MapPage/Map.const'

export function LocationActionButtonsForMovingEntity({
  value,
}: {
  value: unknown
}) {
  const isLoading = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])

  const existingLocation = (isLoading || !isUuid(value))
    ? undefined
    : getLocationByUuidSelector(value)

  let planetarySystemUuid = (isLoading || !isUuid(existingLocation?.planetarySystemUuid))
    ? undefined
    : existingLocation?.planetarySystemUuid

  if (!planetarySystemUuid) {
    planetarySystemUuid = (isLoading || !isUuid(value)) ? undefined : value
  }

  const existingPlanetarySystem = planetarySystemUuid
    ? getPlanetarySystemByUuidSelector(planetarySystemUuid)
    : undefined

  const urlToLocationsPage = getUrlToLocationsPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
  })

  const position = existingLocation ? parsePositionFromString(existingLocation.position) : undefined
  const urlToMapPage = (position && existingPlanetarySystem) && getUrlToMapPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
    mapMode: (!(existingLocation?.id) && !(existingLocation?.name)) ? MAP_MODE_UNIVERSE : undefined,

  })

  return (
    <>
      {urlToLocationsPage ? (
        <InternalStaticLink to={urlToLocationsPage} title="show location info">
          <i className="icon icon-info"></i>
        </InternalStaticLink>
      ) : (
        <Button disabled noBorder noPadding transparent title="no location data">
          <i className="icon icon-location_disabled"></i>
        </Button>
      )}

      {urlToMapPage
        ? (
          <InternalStaticLink to={urlToMapPage} title="show location on map">
            <i className="icon icon-location_on"></i>
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no position data">
            <i className="icon icon-location_off"></i>
          </Button>
        )}
    </>
  )
}
