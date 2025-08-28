import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import type { Order } from '~/models/Order'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'
import { getLocationByUuidSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function LocationActionButtonsForOrder({ item }: { item: Order }) {
  const isLoading = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])

  const existingLocation = isLoading
    ? undefined
    : getLocationByUuidSelector(item.locationUuid)

  const existingPlanetarySystem = (!isLoading && existingLocation?.planetarySystemUuid)
    ? getPlanetarySystemByUuidSelector(existingLocation?.planetarySystemUuid)
    : undefined

  const urlToLocationsPage = getUrlToLocationsPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
  })

  const urlToMapPage = getUrlToMapPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
  })

  const urlToMarketPage = existingPlanetarySystem && getUrlToMarketPageWithParams({
    locationId: existingLocation?.id,
    locationName: existingLocation?.name,
    planetarySystemName: existingPlanetarySystem?.name,
  })

  return (
    <>
      {urlToLocationsPage ? (
        <InternalStaticLink to={urlToLocationsPage} title="show location info">
          <Icon name="info" />
        </InternalStaticLink>
      ) : (
        <Button disabled noBorder noPadding transparent title="no location data">
          <Icon name="location_disabled" />
        </Button>
      )}

      {urlToMapPage
        ? (
            <InternalStaticLink to={urlToMapPage} title="show location on map">
              <Icon name="location_on" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no position data">
              <Icon name="location_off" />
            </Button>
          )}

      {urlToMarketPage
        ? (
            <InternalStaticLink to={urlToMarketPage} title="search by location in market">
              <Icon name="query_stats" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in market">
              <Icon name="search_off" />
            </Button>
          )}
    </>
  )
}
