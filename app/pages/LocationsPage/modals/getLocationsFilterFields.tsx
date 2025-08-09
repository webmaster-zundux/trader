import type { LocationFilter } from '~/models/entities-filters/LocationFilter'
import type { Location } from '~/models/entities/Location'
import type { SelectFieldOption } from '../../../components/forms/fields/SelectField'
import type { FilterField } from '../../../components/tables/hooks/useTableFilter'

type LocationFilterField = FilterField<Location, LocationFilter>

export const getLocationFilterFields = (
  planetarySystemsAsSelectOptions: SelectFieldOption[],
  locationTypesAsSelectOptions: SelectFieldOption[]
): LocationFilterField[] => {
  return [
    {
      name: 'planetarySystemUuid',
      label: 'planetary system',
      type: 'select',
      options: planetarySystemsAsSelectOptions,
      chooseOptionLabel: 'choose a planetary system',
      noOptionsLabel: 'no planetary system available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.planetarySystemUuid === filterValue.planetarySystemUuid
      },
    },
    {
      name: 'locationTypeUuid',
      label: 'type',
      type: 'select',
      options: locationTypesAsSelectOptions,
      chooseOptionLabel: 'choose a location type',
      noOptionsLabel: 'no location type available',
      allowToSelectNoValueOption: true,
      filterPredicate: (item, filterValue) => {
        return item.locationTypeUuid === filterValue.locationTypeUuid
      },
    },
  ]
}
