import { Button } from '~/components/Button'
import { StaticLink } from '~/components/StaticLink'
import { SearchCategoryIcon } from '~/components/icons/SearchCategoryIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import type { MovingEntityClass } from '~/models/entities/MovingEntityClass'
import { getUrlToMovingEntitiesPageWithParams } from '~/router/urlSearchParams/getUrlToMovingEntitiesPageWithParams'
import type { Column } from '../../components/Table'

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
                  <StaticLink href={urlToMovingEntitiesPage} title="search by moving entity class in moving entities">
                    <SearchCategoryIcon />
                  </StaticLink>
                )
              : (
                  <Button disabled noBorder noPadding transparent title="no data for search">
                    <SearchOffIcon />
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
