import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { InternalStaticLink } from '~/components/InternalStaticLink'
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
              <Icon name="info" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in products">
              <Icon name="search_off" />
            </Button>
          )}

      {urlToMarketPage
        ? (
            <InternalStaticLink to={urlToMarketPage} title="search by product name in market">
              <Icon name="query_stats" />
            </InternalStaticLink>
          )
        : (
            <Button disabled noBorder noPadding transparent title="no data for search in market">
              <Icon name="search_off" />
            </Button>
          )}
    </>
  )
}
