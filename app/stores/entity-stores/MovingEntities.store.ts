import type { MovingEntity } from '~/models/entities/MovingEntity'
import { createEntityMapStore } from './createEntityMapStore'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getPlanetarySystemByNameSelector, getPlanetarySystemByUuidSelector } from './PlanetarySystems.store'
import { getLocationByUuidSelector, getLocationsAsArraySelector } from './Locations.store'

export const useMovingEntitiesStore = createEntityMapStore<MovingEntity>({ persistStorageItemKey: 'moving-entities' })

export function getMovingEntitiesAsMapSelector() {
  return useMovingEntitiesStore.getState().entities
}

export function getMovingEntitiesAsArraySelector() {
  return useMovingEntitiesStore.getState().items()
}

export function getMovingEntityByUuidSelector(uuid: MovingEntity['uuid']) {
  return getMovingEntitiesAsMapSelector().get(uuid)
}

export function getMovingEntityByNameSelector(name: MovingEntity['name']) {
  return getMovingEntitiesAsArraySelector().find(item => (item.name.localeCompare(name) === 0))
}

export function getMovingEntityByIdSelector(id: MovingEntity['id']) {
  if (!id) {
    return undefined
  }

  return getMovingEntitiesAsArraySelector().find(item => ((!!item.id) && item.id.localeCompare(id) === 0))
}

export function getMovingEntitiesByIdAndNameSelector({
  id,
  name,
}: {
  id?: MovingEntity['id']
  name?: MovingEntity['name']
}) {
  if (!id && !name) {
    return undefined
  }

  return getMovingEntitiesAsArraySelector().find((item) => {
    if (id && name) {
      return (
        (item.id === id)
        && (item.name === name)
      )
    }

    if (id && !name) {
      return (item.id === id)
    }

    if (!id && name) {
      return (item.name === name)
    }

    return item.name === name
  })
}

export function getMovingEntityByIdCaseInsensetiveExceptItSelfSelector({
  uuid,
  id,
}: {
  uuid: MovingEntity['uuid']
  id?: MovingEntity['id']
}) {
  if (!id) {
    return undefined
  }

  const movingEntityIdInUpperCase = id.toLocaleUpperCase()

  return getMovingEntitiesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (
      !!item.id
      && (item.id.localeCompare(movingEntityIdInUpperCase) === 0)
    )
  ))
}

export function getMovingEntityByOriginalIdCaseInsensetiveExceptItSelfSelector({
  uuid,
  originalId,
}: {
  uuid: MovingEntity['uuid']
  originalId?: MovingEntity['originalId']
}) {
  if (!originalId) {
    return undefined
  }

  const movingEntityOriginalIdInUpperCase = originalId.toLocaleUpperCase()

  return getMovingEntitiesAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (
      !!item.originalId
      && (item.originalId.localeCompare(movingEntityOriginalIdInUpperCase) === 0)
    )
  ))
}

export function getMovingEntityByIdAndNameSelector({
  id,
  name,
}: {
  id?: MovingEntity['id']
  name?: MovingEntity['name']
}) {
  if (!id && !name) {
    return undefined
  }

  return getMovingEntitiesAsArraySelector().find((item) => {
    if (id && name) {
      return (
        (item.id === id)
        && (item.name === name)
      )
    }

    if (id && !name) {
      return (item.id === id)
    }

    if (!id && name) {
      return (item.name === name)
    }

    return item.name === name
  })
}

export function getMovingEntityByIdAndNameAndPlanetarySystemNameSelector({
  id,
  name,
  planetarySystemName,
}: {
  id?: MovingEntity['id']
  name?: MovingEntity['name']
  planetarySystemName?: PlanetarySystem['name']
}): MovingEntity | undefined {
  if (!id && !name && !planetarySystemName) {
    return undefined
  }

  if (planetarySystemName) {
    const planetarySystem = getPlanetarySystemByNameSelector(planetarySystemName)

    if (planetarySystem) {
      const planetarySystemUuid = planetarySystem.uuid

      const allMovingEntities = getMovingEntitiesAsArraySelector()

      // note: item.locationUuid as planetarySystem.uuid
      let movingEntity = allMovingEntities.find((item) => {
        if (id && name) {
          return (
            (item.id === id)
            && (item.name === name)
            && (item.locationUuid === planetarySystemUuid)
          )
        }

        if (id && !name) {
          return (
            (item.id === id)
            && (item.locationUuid === planetarySystemUuid)
          )
        }

        if (!id && name) {
          return (
            (item.name === name)
            && (item.locationUuid === planetarySystemUuid)
          )
        }

        return (
          (item.name === name)
          && (item.locationUuid === planetarySystemUuid)
        )
      })

      if (!movingEntity) {
        // note: item.locationUuid as location.uuid
        const allLocations = getLocationsAsArraySelector()
        const locationsInPlanetarySystem = allLocations.filter(location => location.planetarySystemUuid === planetarySystemUuid)
        const locationsInPlanetarySystemUuids = locationsInPlanetarySystem.map(location => location.uuid)

        movingEntity = allMovingEntities.find((item) => {
          if (id && name) {
            return (
              (item.id === id)
              && (item.name === name)
              && locationsInPlanetarySystemUuids.includes(item.locationUuid)
            )
          }

          if (id && !name) {
            return (
              (item.id === id)
              && locationsInPlanetarySystemUuids.includes(item.locationUuid)
            )
          }

          if (!id && name) {
            return (
              (item.name === name)
              && locationsInPlanetarySystemUuids.includes(item.locationUuid)
            )
          }

          return (
            (item.name === name)
            && locationsInPlanetarySystemUuids.includes(item.locationUuid)
          )
        })
      }

      return movingEntity
    }
  }

  return getMovingEntityByIdAndNameSelector({ id, name })
}

export function getMovingEntitiesByPlanetarySystemUuid(
  selectedPlanetarySystemUuid: PlanetarySystem['uuid']
) {
  const movingEntities = getMovingEntitiesAsArraySelector()

  return movingEntities.filter((movingEntity) => {
    const locationUuid = movingEntity.locationUuid

    if (!locationUuid) {
      return false
    }

    const location = getLocationByUuidSelector(locationUuid)

    if (location) {
      return location.planetarySystemUuid === selectedPlanetarySystemUuid
    }

    const planetarySystem = getPlanetarySystemByUuidSelector(locationUuid)

    if (planetarySystem) {
      return planetarySystem.uuid === selectedPlanetarySystemUuid
    }

    return undefined
  })
}
