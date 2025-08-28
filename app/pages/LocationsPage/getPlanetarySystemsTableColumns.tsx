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
import { Icon } from '~/components/Icon'

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
                <Icon name="rocket_launch" />
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <Icon name="search_off" />
              </Button>
            )}

            {urlToLocationsPage ? (
              <InternalStaticLink to={urlToLocationsPage} title="search locations in the planetary system">
                <Icon name="location_searching" />
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <Icon name="search_off" />
              </Button>
            )}

            {urlToMarketPage ? (
              <InternalStaticLink to={urlToMarketPage} title="search orders in market">
                <Icon name="query_stats" />
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <Icon name="search_off" />
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
                <Icon name="planet_orbit" />
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <Icon name="not_listed_location" />
              </Button>
            )}

            {urlToMapPageWithUniverseMode ? (
              <InternalStaticLink to={urlToMapPageWithUniverseMode} title="show planetary system on map">
                <Icon name="location_on" />
              </InternalStaticLink>
            ) : (
              <Button disabled noBorder noPadding transparent title="no data for search">
                <Icon name="not_listed_location" />
              </Button>
            )}
          </>
        )
      },

    },
  ]
}
