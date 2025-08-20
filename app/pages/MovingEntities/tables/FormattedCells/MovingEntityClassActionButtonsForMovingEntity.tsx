import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { InfoIcon } from '~/components/icons/InfoIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import { isUuid } from '~/models/Entity'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { getUrlToMovingEntitiesPageWithParams } from '~/router/urlSearchParams/getUrlToMovingEntitiesPageWithParams'
import { getMovingEntityClassByUuidSelector, useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function MovingEntityClassActionButtonsForMovingEntity({
  value,
}: {
  value: unknown
  item: MovingEntity
}) {
  const isLoading = useLoadingPersistStorages([useMovingEntityClassesStore])

  const existingMovingEntityClass = (isLoading || !isUuid(value))
    ? undefined
    : getMovingEntityClassByUuidSelector(value)

  const urlToMovingEntitiesPage = getUrlToMovingEntitiesPageWithParams({
    movingEntityClassName: existingMovingEntityClass?.name,
  })

  return (
    <>
      {urlToMovingEntitiesPage ? (
        <InternalStaticLink to={urlToMovingEntitiesPage} title="show moving object class info">
          <InfoIcon />
        </InternalStaticLink>
      ) : (
        <Button disabled noBorder noPadding transparent title="no moving object class data">
          <SearchOffIcon />
        </Button>
      )}
    </>
  )
}
