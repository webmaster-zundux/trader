import { Button } from '~/components/Button'
import { StaticLink } from '~/components/StaticLink'
import { LocationDisabledIcon } from '~/components/icons/LocationDisabledIcon'
import { LocationOffIcon } from '~/components/icons/LocationOffIcon'
import { LocationOnIcon } from '~/components/icons/LocationOnIcon'
import { LocationSearchingIcon } from '~/components/icons/LocationSearchIcon'
import { QueryStatsIcon } from '~/components/icons/QueryStatsIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
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
            <StaticLink href={urlToMapPage} title="show planetary system on map">
              <LocationOnIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no planetary systems data">
              <LocationOffIcon />
            </Button>
          )}

      {urlToLocationsPage
        ? (
            <StaticLink href={urlToLocationsPage} title="search locations in the planetary system">
              <LocationSearchingIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no planetary system data">
              <LocationDisabledIcon />
            </Button>
          )}

      {urlToMarketPage
        ? (
            <StaticLink href={urlToMarketPage} title="search by planetary system name in market">
              <QueryStatsIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in market">
              <SearchOffIcon />
            </Button>
          )}
    </>
  )
}
