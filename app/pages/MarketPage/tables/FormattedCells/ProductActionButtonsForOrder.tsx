import { Button } from '~/components/Button'
import { InternalStaticLink } from '~/components/InternalStaticLink'
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
          <InternalStaticLink to={urlToProductsPage} title="show product info">
            <InfoIcon />
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no data for search in products">
            <SearchOffIcon />
          </Button>
        )}

      {urlToMarketPage
        ? (
          <InternalStaticLink to={urlToMarketPage} title="search by product name in market">
            <QueryStatsIcon />
          </InternalStaticLink>
        )
        : (
          <Button disabled noBorder noPadding transparent title="no data for search in market">
            <SearchOffIcon />
          </Button>
        )}
    </>
  )
}
