import type { PlanetarySystem } from '../../models/entities/PlanetarySystem'
import { createEntityMapStore } from './createEntityMapStore'

export const usePlanetarySystemsStore = createEntityMapStore<PlanetarySystem>({ persistStorageItemKey: 'planetary-systems' })

export function getPlanetarySystemsSelector() {
  return usePlanetarySystemsStore.getState()
}

export function getPlanetarySystemsAsMapSelector() {
  return getPlanetarySystemsSelector().entities
}

export function getPlanetarySystemsAsArraySelector() {
  return getPlanetarySystemsSelector().items()
}

export function getPlanetarySystemByUuidSelector(uuid: PlanetarySystem['uuid']) {
  return getPlanetarySystemsAsMapSelector().get(uuid)
}

export function getPlanetarySystemByNameSelector(name: PlanetarySystem['name']) {
  return getPlanetarySystemsAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getPlanetarySystemByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: PlanetarySystem) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getPlanetarySystemsAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}

export function getPlanetarySystemByPositionExceptItSelfSelector({ uuid, position }: PlanetarySystem) {
  return getPlanetarySystemsAsArraySelector().find((item: PlanetarySystem) => (
    (item.uuid !== uuid)
    && (item.position === position)
  ))
}
