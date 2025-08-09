import type { LocationFilter } from '~/models/entities-filters/LocationFilter'
import type { FilterInfoField } from '../../../components/TableSelectedFilterInfo'
import { FormattedLocationTypeNameForLocationsTableFilter } from './FormattedLocationTypeNameForLocationsTableFilter'
import { FormattedPlanetarySystemNameForLocationsTableFilter } from './FormattedPlanetarySystemNameForLocationsTableFilter'

export function getLocationsTableFilterInfoFields(): FilterInfoField<LocationFilter>[] {
  return [
    {
      name: 'planetarySystemUuid',
      label: 'planetary system',
      formatLabelAndValue: FormattedPlanetarySystemNameForLocationsTableFilter,
    },
    {
      name: 'locationTypeUuid',
      label: 'type',
      formatLabelAndValue: FormattedLocationTypeNameForLocationsTableFilter,
    },
  ]
}
