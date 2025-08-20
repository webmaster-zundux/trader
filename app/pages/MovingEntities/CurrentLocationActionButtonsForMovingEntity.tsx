import { isUuid } from '~/models/Entity'
import { parsePositionFromString } from '~/models/Position'
import type { MovingEntity } from '~/models/entities/MovingEntity'
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

export function CurrentLocationActionButtonsForMovingEntity({
  value,
  item,
}: {
  value: unknown
  item: MovingEntity
}) {
  const isLoading = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])

  const existingLocation = (isLoading || !isUuid(value))
    ? undefined
    : getLocationByUuidSelector(value)

  let planetarySystemUuid = (isLoading || !isUuid(existingLocation?.planetarySystemUuid))
    ? undefined
    : existingLocation?.planetarySystemUuid

  if (!planetarySystemUuid && isUuid(value)) {
    planetarySystemUuid = value
  }

  const existingPlanetarySystem = planetarySystemUuid
    ? getPlanetarySystemByUuidSelector(planetarySystemUuid)
    : undefined

  const urlToLocationsPage = getUrlToLocationsPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
  })

  let position

  if (existingLocation) {
    position = parsePositionFromString(existingLocation?.position)
  } else {
    position = parsePositionFromString(item.position)
  }

  const urlToMapPage = (position && existingPlanetarySystem) && getUrlToMapPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
    position: existingLocation ? undefined : item.position,
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
          <InternalStaticLink to={urlToMapPage} title={`show ${existingLocation ? 'location' : 'position'} on map`}>
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
