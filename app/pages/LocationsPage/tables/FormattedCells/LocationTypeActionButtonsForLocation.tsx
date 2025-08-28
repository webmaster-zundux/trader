import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import { isUuid } from '~/models/Entity'
import { getUrlToLocationsPageWithParams } from '~/router/urlSearchParams/getUrlToLocationsPageWithParams'
import { getLocationTypeByUuidSelector, useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function LocationTypeActionButtonsForLocation({
  value
}: {
  value: unknown
}) {
  const isLoading = useLoadingPersistStorages([useLocationTypesStore])

  const locationTypeName = (isLoading || !isUuid(value))
    ? undefined
    : getLocationTypeByUuidSelector(value)?.name

  const urlToLocationsPage = getUrlToLocationsPageWithParams({
    locationTypeName: locationTypeName,
  })

  return (
    <>
      {urlToLocationsPage
        ? (
            <InternalStaticLink to={urlToLocationsPage} title="search locations by type">
              <Icon name="location_searching" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no location type data">
              <Icon name="location_disabled" />
            </Button>
          )}
    </>
  )
}
