import type { FormatLabelAndValue, FormatLabelAndValueProps } from '~/components/TableSelectedFilterInfo'
import { isUuid } from '~/models/Entity'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function FormattedPlanetarySystemNameForLocationsTableFilter<T>({
  name,
  label,
  value
}: FormatLabelAndValueProps<T>): ReturnType<FormatLabelAndValue<T>> {
  const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore])

  if (!value) {
    return undefined
  }
  const planetarySystemName = (isLoading || !isUuid(value)) ? undefined : getPlanetarySystemByUuidSelector(value)?.name

  if (!planetarySystemName) {
    return {
      label: label ?? name?.toString(),
      value: `(planetary system without name)`,
    }
  }

  return {
    label: label ?? name?.toString(),
    value: planetarySystemName,
  }
}
