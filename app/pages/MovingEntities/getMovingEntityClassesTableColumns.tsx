import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import { getUrlToMovingEntitiesPageWithParams } from '~/router/urlSearchParams/getUrlToMovingEntitiesPageWithParams'
import type { Column } from '../../components/Table'
import { Icon } from '~/components/Icon'

export function getMovingEntityClassesTableColumns(): Column<MovingEntityClass>[] {
  return [
    {
      name: `uuid`,
      isCheckbox: true,
    },
    {
      name: `name`,
      asLinkToEditItem: true,
      isSortable: true,
      sort: 'asc',
      alignLabel: 'left',
      actionButtons: function MovingEntityClassNameActionButtonsForMovingEntityClass({ item }) {
        const urlToMovingEntitiesPage = getUrlToMovingEntitiesPageWithParams({
          movingEntityClassName: item?.name
        })

        return (
          <>
            {urlToMovingEntitiesPage
              ? (
                  <InternalStaticLink to={urlToMovingEntitiesPage} title="search by moving entity class in moving entities">
                    <Icon name="search_category" />
                  </InternalStaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <Icon name="search_off" />
                  </Button>
                )}
          </>
        )
      },
    },
    {
      name: `note`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'left',
    },
  ]
}
