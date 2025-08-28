import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { type Column, NoDataCell } from '~/components/Table'
import type { Location } from '~/models/entities/Location'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'
import { FormattedPositionForLocationAndMovingEntity } from '../MovingEntities/tables/FormattedCells/FormattedPositionForLocationAndMovingEntity'
import { FormattedLocationTypeNameForLocation } from './tables/FormattedCells/FormattedLocationTypeNameForLocation'
import { FormattedPlanetarySystemNameForLocation } from './tables/FormattedCells/FormattedPlanetarySystemNameForLocation'
import { LocationPositionActionButtonsForLocation } from './tables/FormattedCells/LocationPositionActionButtonsForLocation'
import { LocationTypeActionButtonsForLocation } from './tables/FormattedCells/LocationTypeActionButtonsForLocation'
import { PlanetarySystemActionButtonsForLocation } from './tables/FormattedCells/PlanetarySystemActionButtonsForLocation'
import { sortItemsByLocationTypeName } from './tables/sortBy/sortItemsByLocationTypeName'
import { sortItemsByPlanetarySystemName } from './tables/sortBy/sortItemsByPlanetarySystemName'
import { Icon } from '~/components/Icon'

export function getLocationsTableColumns(): Column<Location>[] {
  return [
    {
      name: `uuid`,
      isCheckbox: true,
    },
    {
      name: `id`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'center',
      uppercase: true,
      monospaced: true,
      nowrap: true,
      isSearchCaseInsensitive: true,
      formatValue: function FormattedLocationId({ value }) {
        return (
          <>
            {(typeof value === 'string')
              ? value
              : (
                  <NoDataCell>
                    (no&nbsp;id)
                  </NoDataCell>
                )}
          </>
        )
      },
      actionButtons: function LocationIdActionButtons({ value }) {
        const urlToMarketPage = getUrlToMarketPageWithParams({
          locationId: value,
        })

        return (
          <>
            {urlToMarketPage
              ? (
                  <InternalStaticLink to={urlToMarketPage} title="search by location id in market">
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
      },
    },
    {
      name: `name`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'left',
      actionButtons: function NameActionButtons({ value }) {
        const urlToMarketPage = getUrlToMarketPageWithParams({
          locationName: value,
        })

        return (
          <>
            {urlToMarketPage
              ? (
                  <InternalStaticLink to={urlToMarketPage} title="search by location name in market">
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
      },
    },
    {
      name: `locationTypeUuid`,
      label: 'type',
      isSortable: true,
      alignLabel: 'left',
      formatValue: FormattedLocationTypeNameForLocation,
      actionButtons: LocationTypeActionButtonsForLocation,
      sortFn: sortItemsByLocationTypeName,
    },
    {
      name: `position`,
      isSortable: true,
      alignLabel: 'right',
      monospaced: true,
      formatValue: FormattedPositionForLocationAndMovingEntity,
      actionButtons: LocationPositionActionButtonsForLocation,
    },
    {
      name: `planetarySystemUuid`,
      label: 'planetary system',
      isSortable: true,
      sort: 'asc',
      alignLabel: 'right',
      formatValue: FormattedPlanetarySystemNameForLocation,
      actionButtons: PlanetarySystemActionButtonsForLocation,
      sortFn: sortItemsByPlanetarySystemName,
    },
  ]
}
