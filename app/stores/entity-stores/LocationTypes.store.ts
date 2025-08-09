import type { LocationType } from '../../models/entities/LocationType'
import { createEntityMapStore } from './createEntityMapStore'

export const useLocationTypesStore = createEntityMapStore<LocationType>({ persistStorageItemKey: 'location-types' })

export function getLocationTypesSelector() {
  return useLocationTypesStore.getState()
}

export function getLocationTypesAsMapSelector() {
  return getLocationTypesSelector().entities
}

export function getLocationTypesAsArraySelector() {
  return getLocationTypesSelector().items()
}

export function getLocationTypeByUuidSelector(uuid: LocationType['uuid']) {
  return getLocationTypesAsMapSelector().get(uuid)
}

export function getLocationTypeByNameSelector(name: LocationType['name']) {
  return getLocationTypesAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getLocationTypeByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: LocationType) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getLocationTypesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}
