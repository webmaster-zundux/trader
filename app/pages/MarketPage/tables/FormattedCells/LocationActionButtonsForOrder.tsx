import { Button } from '~/components/Button'
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

      {urlToMarketPage
        ? (
          <InternalStaticLink to={urlToMarketPage} title="search by location in market">
            <i className="icon icon-query_stats"></i>
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no data for search in market">
            <i className="icon icon-search_off"></i>
          </Button>
        )}
    </>
  )
}
