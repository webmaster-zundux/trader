import { isUuid } from '~/models/Entity'
import { parsePositionFromString } from '~/models/Position'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { Button } from '../../components/Button'
import { InternalStaticLink } from '../../components/InternalStaticLink'
import { InfoIcon } from '../../components/icons/InfoIcon'
import { LocationDisabledIcon } from '../../components/icons/LocationDisabledIcon'
import { LocationOffIcon } from '../../components/icons/LocationOffIcon'
import { LocationOnIcon } from '../../components/icons/LocationOnIcon'
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
          <InfoIcon />
        </InternalStaticLink>
      ) : (
        <Button disabled noBorder noPadding transparent title="no location data">
          <LocationDisabledIcon />
        </Button>
      )}

      {urlToMapPage
        ? (
          <InternalStaticLink to={urlToMapPage} title="show location on map">
            <LocationOnIcon />
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no position data">
            <LocationOffIcon />
          </Button>
        )}
    </>
  )
}
