import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
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
              <Icon name="location_on" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no planetary systems data">
              <Icon name="location_off" />
            </Button>
          )}

      {urlToLocationsPage
        ? (
            <InternalStaticLink to={urlToLocationsPage} title="search locations in the planetary system">
              <Icon name="location_searching" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no planetary system data">
              <Icon name="location_disabled" />
            </Button>
          )}

      {urlToMarketPage
        ? (
            <InternalStaticLink to={urlToMarketPage} title="search by planetary system name in market">
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
