import type { Column } from '../../components/Table'
import { type MovingEntity } from '../../models/entities/MovingEntity'
import { FormattedLocationFullName } from '../MarketPage/tables/FormattedCells/FormattedLocationFullName'
import { sortItemsByLocationFullName } from '../MarketPage/tables/sortBy/sortItemsByLocationFullNameForOrder'
import { CurrentLocationActionButtonsForMovingEntity } from './CurrentLocationActionButtonsForMovingEntity'
import { LocationActionButtonsForMovingEntity } from './LocationActionButtonsForMovingEntity'
import { FormattedIdForMovingEntity } from './tables/FormattedCells/FormattedIdForMovingEntity'
import { FormattedMovingEntityClassForMovingEntity } from './tables/FormattedCells/FormattedMovingEntityClassForMovingEntity'
import { MovingEntityClassActionButtonsForMovingEntity } from './tables/FormattedCells/MovingEntityClassActionButtonsForMovingEntity'
import { sortItemsByMovingEntityClassName } from './tables/sortBy/sortItemsByMovingEntityClassName'

export function getMovingEntitiesTableColumns(): Column<MovingEntity>[] {
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
      formatValue: FormattedIdForMovingEntity,
    },
    {
      name: `originalId`,
      label: `original id`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'center',
      uppercase: true,
      monospaced: true,
      nowrap: true,
      isSearchCaseInsensitive: true,
      formatValue: FormattedIdForMovingEntity,
    },
    {
      name: 'movingEntityClassUuid',
      label: 'class',
      isSortable: true,
      sort: 'asc',
      alignLabel: 'center',
      formatValue: FormattedMovingEntityClassForMovingEntity,
      actionButtons: MovingEntityClassActionButtonsForMovingEntity,
      sortFn: sortItemsByMovingEntityClassName,
    },
    {
      name: `name`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'left',
    },
    {
      name: 'locationUuid',
      label: 'location',
      alignLabel: 'right',
      isSortable: true,
      formatValue: FormattedLocationFullName,
      actionButtons: CurrentLocationActionButtonsForMovingEntity,
      sortFn: sortItemsByLocationFullName,
    },
    {
      name: 'destinationLocationUuid',
      label: 'destination',
      alignLabel: 'right',
      isSortable: true,
      formatValue: FormattedLocationFullName,
      actionButtons: LocationActionButtonsForMovingEntity,
      sortFn: sortItemsByLocationFullName,
    },
    {
      name: 'homeLocationUuid',
      label: 'home',
      alignLabel: 'right',
      isSortable: true,
      formatValue: FormattedLocationFullName,
      actionButtons: LocationActionButtonsForMovingEntity,
      sortFn: sortItemsByLocationFullName,
    },
  ]
}
