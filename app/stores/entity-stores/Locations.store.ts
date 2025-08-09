import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { Location } from '../../models/entities/Location'
import { getPlanetarySystemByNameSelector } from './PlanetarySystems.store'
import { createEntityMapStore } from './createEntityMapStore'

export const useLocationsStore = createEntityMapStore<Location>({ persistStorageItemKey: 'locations' })

export function getLocationsSelector() {
  return useLocationsStore.getState()
}

export function getLocationsAsMapSelector() {
  return useLocationsStore.getState().entities
}

export function getLocationsAsArraySelector() {
  return useLocationsStore.getState().items()
}

export function getLocationByUuidSelector(uuid: Location['uuid']) {
  return getLocationsAsMapSelector().get(uuid)
}

export function getLocationByIdCaseInsensetiveExceptItSelfSelector({
  uuid,
  id,
}: {
  uuid: Location['uuid']
  id?: Location['id']
}) {
  if (!id) {
    return undefined
  }

  const locationIdInUpperCase = id.toLocaleUpperCase()

  return getLocationsAsArraySelector().find(item => (
    (item.uuid !== uuid)
    && (
      !!item.id
      && (item.id.localeCompare(locationIdInUpperCase) === 0)
    )
  ))
}

export function getLocationByNameAndPlanetarySystemUuidExceptItSelfSelector({
  uuid,
  name,
  planetarySystemUuid
}: Location) {
  const locations = getLocationsAsArraySelector()

  return locations.find((item: Location) => (
    ((item.uuid !== uuid)
      && (item.planetarySystemUuid === planetarySystemUuid)
      && (item.name.localeCompare(name) === 0)
    ))
  )
}

export function getLocationByIdAndNameSelector({
  id,
  name,
}: {
  id?: Location['id']
  name?: Location['name']
}) {
  if (!id && !name) {
    return undefined
  }

  return getLocationsAsArraySelector().find((item) => {
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

export function getLocationByIdAndNameAndPlanetarySystemNameSelector({
  id,
  name,
  planetarySystemName,
}: {
  id?: Location['id']
  name?: Location['name']
  planetarySystemName?: PlanetarySystem['name']
}): Location | undefined {
  if (!id && !name && !planetarySystemName) {
    return undefined
  }

  if (planetarySystemName) {
    const planetarySystem = getPlanetarySystemByNameSelector(planetarySystemName)

    if (planetarySystem) {
      const planetarySystemUuid = planetarySystem.uuid

      const location = getLocationsAsArraySelector().find((item) => {
        if (id && name) {
          return (
            (item.id === id)
            && (item.name === name)
            && (item.planetarySystemUuid === planetarySystemUuid)
          )
        }

        if (id && !name) {
          return (
            (item.id === id)
            && (item.planetarySystemUuid === planetarySystemUuid)
          )
        }

        if (!id && name) {
          return (
            (item.name === name)
            && (item.planetarySystemUuid === planetarySystemUuid)
          )
        }

        return (
          (item.name === name)
          && (item.planetarySystemUuid === planetarySystemUuid)
        )
      })

      return location
    }
  }

  return getLocationByIdAndNameSelector({ id, name })
}

export function getLocationsByPlanetarySystemUuid(
  selectedPlanetarySystemUuid: PlanetarySystem['uuid']
) {
  const locations = getLocationsAsArraySelector()

  return locations.filter(location => location.planetarySystemUuid === selectedPlanetarySystemUuid)
}
