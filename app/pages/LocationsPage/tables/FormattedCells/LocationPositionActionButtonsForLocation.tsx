import { useMemo } from 'react'
import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { isUuid } from '~/models/Entity'
import { parsePositionFromString } from '~/models/Position'
import type { Location } from '~/models/entities/Location'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function LocationPositionActionButtonsForLocation({
  value,
  item,
}: {
  value: unknown
  item: Location
}) {
  const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore, useLocationsStore])

  const locationUuid = item.uuid
  const location = (isLoading || !isUuid(locationUuid))
    ? undefined
    : getLocationByUuidSelector(locationUuid)

  const planetarySystemUuid = location ? location.planetarySystemUuid : undefined
  const planetarySystem = (isLoading || !isUuid(planetarySystemUuid))
    ? undefined
    : getPlanetarySystemByUuidSelector(planetarySystemUuid)

  const position = useMemo(function positionMemo() {
    return parsePositionFromString(value)
  }, [value])

  const urlToMapPage = position && getUrlToMapPageWithParams({
    locationId: location?.id,
    locationName: location?.name,
    planetarySystemName: planetarySystem?.name,
  })

  return (
    <>
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
