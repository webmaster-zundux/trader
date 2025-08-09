import type { MovingEntityFilter } from '~/models/entities-filters/MovingEntityFilter'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { SelectFieldOption } from '../../components/forms/fields/SelectField'
import type { FilterField } from '../../components/tables/hooks/useTableFilter'
import { movingEntitiesTableFilterPredicate } from './movingEntitiesTableFilterPredicate'

type MovingEntityFilterField = FilterField<MovingEntity, MovingEntityFilter>

export const getMovingEntityFilterFields = (
  movingEntitiesAsSelectOptions: SelectFieldOption[],
  locationsAsSelectOptions: SelectFieldOption[]
): MovingEntityFilterField[] => {
  return [
    {
      name: 'movingEntityClassUuid',
      label: 'class',
      type: 'select',
      options: movingEntitiesAsSelectOptions,
      chooseOptionLabel: 'choose a moving entity class',
      noOptionsLabel: 'no moving entity classes available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.movingEntityClassUuid === filterValue.movingEntityClassUuid
      },
    },
    {
      name: 'locationUuid',
      label: 'location',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no location available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => movingEntitiesTableFilterPredicate(item.locationUuid, filterValue.locationUuid),
    },
    {
      name: 'destinationLocationUuid',
      label: 'destination',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no location available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => movingEntitiesTableFilterPredicate(item.destinationLocationUuid, filterValue.destinationLocationUuid),
    },
    {
      name: 'homeLocationUuid',
      label: 'home',
      type: 'select',
      options: locationsAsSelectOptions,
      chooseOptionLabel: 'choose a location',
      noOptionsLabel: 'no location available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => movingEntitiesTableFilterPredicate(item.homeLocationUuid, filterValue.homeLocationUuid),
    },
  ]
}
