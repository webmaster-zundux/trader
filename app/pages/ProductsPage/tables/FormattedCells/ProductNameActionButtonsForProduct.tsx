import { Button } from '~/components/Button'
import { StaticLink } from '~/components/StaticLink'
import { QueryStatsIcon } from '~/components/icons/QueryStatsIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import type { Product } from '~/models/entities/Product'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'

export function ProductNameActionButtonsForProduct({
  value,
}: {
  value: unknown
  item: Product
}) {
  const urlToMarketPage = getUrlToMarketPageWithParams({
    productName: (typeof value === 'string' && !!value)
      ? value
      : undefined,
  })

  return (
    <>
      {urlToMarketPage
        ? (
            <StaticLink href={urlToMarketPage} title="search by product name in market">
              <QueryStatsIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search">
              <SearchOffIcon />
            </Button>
          )}
    </>
  )
}
