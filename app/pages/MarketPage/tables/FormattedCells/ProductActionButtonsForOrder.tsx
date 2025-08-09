import { Button } from '~/components/Button'
import { StaticLink } from '~/components/StaticLink'
import { InfoIcon } from '~/components/icons/InfoIcon'
import { QueryStatsIcon } from '~/components/icons/QueryStatsIcon'
import { SearchOffIcon } from '~/components/icons/SearchOffIcon'
import type { Order } from '~/models/Order'
import { getUrlToMarketPageWithParams } from '~/router/urlSearchParams/getUrlToMarketPageWithParams'
import { getUrlToProductsPageWithParams } from '~/router/urlSearchParams/getUrlToProductsPageWithParams'
import { getProductByUuidSelector, useProductsStore } from '~/stores/entity-stores/Products.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function ProductActionButtonsForOrder({ item }: { item: Order }) {
  const isLoading = useLoadingPersistStorages([useProductsStore])
  const productName = isLoading ? undefined : getProductByUuidSelector(item.productUuid)?.name

  const urlToMarketPage = getUrlToMarketPageWithParams({
    productName: productName,
  })

  const urlToProductsPage = getUrlToProductsPageWithParams({
    productName: productName,
  })

  return (
    <>
      {urlToProductsPage
        ? (
            <StaticLink href={urlToProductsPage} title="show product info">
              <InfoIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in products">
              <SearchOffIcon />
            </Button>
          )}

      {urlToMarketPage
        ? (
            <StaticLink href={urlToMarketPage} title="search by product name in market">
              <QueryStatsIcon />
            </StaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in market">
              <SearchOffIcon />
            </Button>
          )}
    </>
  )
}
