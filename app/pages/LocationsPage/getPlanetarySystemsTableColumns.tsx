import { Button } from '~/components/Button'
import { LocationOnIcon } from '~/components/icons/LocationOnIcon'
import { LocationSearchingIcon } from '~/components/icons/LocationSearchIcon'
import { NotListedLocation } from '~/components/icons/NotListedLocationIcon'
import { PlanetOrbitIcon } from '~/components/icons/PlanetOrbitIcon'
import { QueryStatsIcon } from '~/components/icons/QueryStatsIcon'
import { RocketLaunchIcon } from '~/components/icons/RocketLaunchIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import { StaticLink } from '~/components/StaticLink'
import type { Column } from '~/components/Table'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { parsePositionFromString } from '~/models/Position'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'
import { getUrlToMovingEntitiesPageWithParams } from '~/router/urlSearchParams/getUrlToMovingEntitiesPageWithParams'
import { MAP_MODE_UNIVERSE } from '../MapPage/Map.const'
import { FormattedPositionForPlanetarySystem } from './tables/FormattedCells/FormattedPositionForPlanetarySystem'

export function getPlanetarySystemsTableColumns(): Column<PlanetarySystem>[] {
  return [
    {
      name: 'uuid',
      isCheckbox: true,
    },
    {
      name: 'name',
      asLinkToEditItem: true,
      isSortable: true,
      sort: 'asc',
      alignLabel: 'left',
      actionButtons: function PlanetarySystemNameActionButtons({ item }) {
        const urlToLocationsPage = getUrlToLocationsPageWithParams({
          planetarySystemName: item?.name,
        })

        const urlToMovingEntitiesPage = getUrlToMovingEntitiesPageWithParams({
          planetarySystemName: item?.name,
        })

        const urlToMarketPage = getUrlToMarketPageWithParams({
          planetarySystemName: item?.name,
        })

        return (
          <>
            {urlToMovingEntitiesPage
              ? (
                  <StaticLink href={urlToMovingEntitiesPage} title="search moving objects in the planetary system">
                    <RocketLaunchIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <SearchOffIcon />
                  </Button>
                )}

            {urlToLocationsPage
              ? (
                  <StaticLink href={urlToLocationsPage} title="search locations in the planetary system">
                    <LocationSearchingIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <SearchOffIcon />
                  </Button>
                )}

            {urlToMarketPage
              ? (
                  <StaticLink href={urlToMarketPage} title="search orders in market">
                    <QueryStatsIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <SearchOffIcon />
                  </Button>
                )}
          </>
        )
      },
    },
    {
      name: 'position',
      isSortable: true,
      monospaced: true,
      formatValue: FormattedPositionForPlanetarySystem,
      actionButtons: function PlanetarySystemPositionActionButtons({ item }) {
        const position = parsePositionFromString(item.position)

        const urlToMapPageWithPlanetarySystemMode = getUrlToMapPageWithParams({
          planetarySystemName: item?.name,
        })

        const urlToMapPageWithUniverseMode = position && getUrlToMapPageWithParams({
          planetarySystemName: item?.name,
          mapMode: MAP_MODE_UNIVERSE
        })

        return (
          <>
            {urlToMapPageWithPlanetarySystemMode
              ? (
                  <StaticLink href={urlToMapPageWithPlanetarySystemMode} title="show on map what the planetary system contains">
                    <PlanetOrbitIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <NotListedLocation />
                  </Button>
                )}

            {urlToMapPageWithUniverseMode
              ? (
                  <StaticLink href={urlToMapPageWithUniverseMode} title="show planetary system on map">
                    <LocationOnIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <NotListedLocation />
                  </Button>
                )}
          </>
        )
      },

    },
  ]
}
