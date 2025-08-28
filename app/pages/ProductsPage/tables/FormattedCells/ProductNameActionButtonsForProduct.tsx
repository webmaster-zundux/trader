import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
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
            <InternalStaticLink to={urlToMarketPage} title="search by product name in market">
              <Icon name="query_stats" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search">
              <Icon name="search_off" />
            </Button>
          )}
    </>
  )
}
