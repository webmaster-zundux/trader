import type { MovingEntityClass } from '../../models/entities/MovingEntityClass'
import { createEntityMapStore } from './createEntityMapStore'

export const useMovingEntityClassesStore = createEntityMapStore<MovingEntityClass>({
  persistStorageItemKey: 'moving-entity-classes'
})

export function getMovingEntityClassesAsMapSelector() {
  return useMovingEntityClassesStore.getState().entities
}

export function getMovingEntityClassesAsArraySelector() {
  return useMovingEntityClassesStore.getState().items()
}

export function getLoadingStatusForMovingEntityClassesSelector() {
  return useMovingEntityClassesStore.getState().isHydrating
}

export function getMovingEntityClassByUuidSelector(uuid: MovingEntityClass['uuid']) {
  return getMovingEntityClassesAsMapSelector().get(uuid)
}

export function getMovingEntityClassByNameSelector(name: MovingEntityClass['name']) {
  return getMovingEntityClassesAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getMovingEntityClassByNameCaseInsensetiveExceptItSelfSelector({ uuid, name }: MovingEntityClass) {
  const nameInLowerCase = name.toLocaleLowerCase()

  return getMovingEntityClassesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (item.name.localeCompare(nameInLowerCase) === 0)
  ))
}
