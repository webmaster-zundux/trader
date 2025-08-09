import type { MovingEntityFilter } from '~/models/entities-filters/MovingEntityFilter'
import type { FilterInfoField } from '../../../components/TableSelectedFilterInfo'
import { FormattedLocationNameForMovingEntitiesTableFilter } from './FormattedLocationNameForMovingEntitiesTableFilter'
import { FormattedMovingEntityClassNameForMovingEntitiesTableFilter } from './FormattedMovingEntityClassNameForMovingEntitiesTableFilter'

export function getMovingEntitiesTableFilterInfoFields(): FilterInfoField<MovingEntityFilter>[] {
  return [
    {
      name: 'movingEntityClassUuid',
      label: 'class',
      formatLabelAndValue: FormattedMovingEntityClassNameForMovingEntitiesTableFilter,
    },
    {
      name: 'locationUuid',
      label: 'type',
      formatLabelAndValue: FormattedLocationNameForMovingEntitiesTableFilter
    },
    {
      name: 'homeLocationUuid',
      label: 'type',
      formatLabelAndValue: FormattedLocationNameForMovingEntitiesTableFilter
    },
    {
      name: 'destinationLocationUuid',
      label: 'type',
      formatLabelAndValue: FormattedLocationNameForMovingEntitiesTableFilter
    },
  ]
}
