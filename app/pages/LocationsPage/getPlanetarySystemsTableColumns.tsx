import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
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
            {urlToMovingEntitiesPage ? (
              <InternalStaticLink to={urlToMovingEntitiesPage} title="search moving objects in the planetary system">
                <i className="icon icon-rocket_launch"></i>
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-search_off"></i>
              </Button>
            )}

            {urlToLocationsPage ? (
              <InternalStaticLink to={urlToLocationsPage} title="search locations in the planetary system">
                <i className="icon icon-location_searching"></i>
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-search_off"></i>
              </Button>
            )}

            {urlToMarketPage ? (
              <InternalStaticLink to={urlToMarketPage} title="search orders in market">
                <i className="icon icon-query_stats"></i>
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-search_off"></i>
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
            {urlToMapPageWithPlanetarySystemMode ? (
              <InternalStaticLink to={urlToMapPageWithPlanetarySystemMode} title="show on map what the planetary system contains">
                <i className="icon icon-planet_orbit"></i>
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-not_listed_location"></i>
              </Button>
            )}

            {urlToMapPageWithUniverseMode ? (
              <InternalStaticLink to={urlToMapPageWithUniverseMode} title="show planetary system on map">
                <i className="icon icon-location_on"></i>
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <i className="icon icon-not_listed_location"></i>
              </Button>
            )}
          </>
        )
      },

    },
  ]
}
