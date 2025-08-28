import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { isUuid } from '~/models/Entity'
import { parsePositionFromString, positionToString } from '~/models/Position'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { getUrlToMapPageWithParams } from '~/router/urlSearchParams/getUrlToMapPageWithParams'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function PositionActionButtonsForMovingEntity({
  item
}: {
  item: MovingEntity
}) {
  const isLoading = useLoadingPersistStorages([usePlanetarySystemsStore, useLocationsStore])

  if (isLoading || !isUuid(item.locationUuid)) {
    return
  }

  const planetarySystemUuid = (isLoading || !isUuid(item.locationUuid)) ? undefined : item.locationUuid
  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined

  const movingEntityPosition = parsePositionFromString(item.position)
  const movingEntityPositionAsString = movingEntityPosition ? positionToString(movingEntityPosition) : undefined

  const urlToMapPage = movingEntityPositionAsString && planetarySystem && getUrlToMapPageWithParams({
    movingEntityId: item?.id,
    movingEntityName: item?.name,
    planetarySystemName: planetarySystem?.name,
  })

  return (
    <>
      {urlToMapPage
        ? (
            <InternalStaticLink to={urlToMapPage} title="show location on map">
              <Icon name="location_on" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no position data">
              <Icon name="location_off" />
            </Button>
          )}
    </>
  )
}
