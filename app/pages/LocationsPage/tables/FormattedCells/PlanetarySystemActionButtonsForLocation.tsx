import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { isUuid } from '~/models/Entity'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function PlanetarySystemActionButtonsForLocation({
  value
}: {
  value: unknown
}) {
  const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore])

  const planetarySystemName = (isLoading || !isUuid(value))
    ? undefined
    : getPlanetarySystemByUuidSelector(value)?.name

  const urlToMapPage = getUrlToMapPageWithParams({
    planetarySystemName: planetarySystemName,
  })

  const urlToLocationsPage = getUrlToLocationsPageWithParams({
    planetarySystemName: planetarySystemName,
  })

  const urlToMarketPage = getUrlToMarketPageWithParams({
    planetarySystemName: planetarySystemName,
  })

  return (
    <>
      {urlToMapPage
        ? (
          <InternalStaticLink to={urlToMapPage} title="show planetary system on map">
            <i className="icon icon-location_on"></i>
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no planetary systems data">
            <i className="icon icon-location_off"></i>
          </Button>
        )}

      {urlToLocationsPage
        ? (
          <InternalStaticLink to={urlToLocationsPage} title="search locations in the planetary system">
            <i className="icon icon-location_searching"></i>
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no planetary system data">
            <i className="icon icon-location_disabled"></i>
          </Button>
        )}

      {urlToMarketPage
        ? (
          <InternalStaticLink to={urlToMarketPage} title="search by planetary system name in market">
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
