import { memo, useEffect, useMemo } from 'react'
import { Button } from '~/components/Button'
import { SearchAndFilterFormContainer } from '~/components/SearchAndFilterFormContainer'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getProductNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { createLocationFullNameFromParts } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { Main } from '../../components/Main'
import { PAGE_TITLE_MARKET_WITH_SEARCH_PARAMS_FN } from './MarketPage.const'
import styles from './MarketPage.module.css'
import { MarketFilterDialog } from './modals/MarketFilterDialog'
import { BuyOrdersTable } from './tables/BuyOrdersTable'
import { SellOrdersTable } from './tables/SellOrdersTable'
import { getOrdersTableUrlSearchParams, useOrdersTableFilter } from './useOrdersTableFilter'
import { useOrdersTableSearch } from './useOrdersTableSearch'

function useLocationsPageTitle(urlSearchParams: URLSearchParams): string {
  const searchingLocationFullName = useMemo(() => {
    const searchingFilterValue = getOrdersTableUrlSearchParams(urlSearchParams)

    return createLocationFullNameFromParts({
      id: searchingFilterValue?.locationId,
      name: searchingFilterValue?.locationName,
      planetarySystemName: searchingFilterValue?.planetarySystemName,
    })
  }, [urlSearchParams])

  const searchingProductName = useMemo(() => getProductNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleWithAppName(PAGE_TITLE_MARKET_WITH_SEARCH_PARAMS_FN({
      productName: searchingProductName,
      locationName: searchingLocationFullName,
    }))
  }, [searchingProductName, searchingLocationFullName])

  return pageTitle
}

export const MarketPage = memo(function MarketPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const pageTitle = useLocationsPageTitle(urlSearchParams)

  const {
    marketFilterValue,
    setMarketFilterValueToUrlSearchParams,
  } = useOrdersTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useOrdersTableSearch({ urlSearchParams, setUrlSearchParams })

  const {
    isVisible: isVisibleMarketFilterDialog,
    show: showMarketFilterDialog,
    hide: hideMarketFilerDialog,
  } = useIsVisible(false)

  useEffect(function hideMarketFilterDialogWhenFilterValueChangesEffect() {
    // e.g. when dialog is open and user moving back or forth by navigation history
    if (marketFilterValue || !marketFilterValue) {
      hideMarketFilerDialog()
    }
  }, [marketFilterValue, hideMarketFilerDialog])

  return (
    <>
      <title>{pageTitle}</title>

      <Main>

        <SearchAndFilterFormContainer>

          {SearchForm}

          <Button
            title="show filter form"
            onClick={showMarketFilterDialog}
          >
            <i className="icon icon-tune"></i>
            <span>filter</span>
          </Button>

          {isVisibleMarketFilterDialog && (
            <MarketFilterDialog
              filterValue={marketFilterValue}
              onSetFilterValue={setMarketFilterValueToUrlSearchParams}
              onHide={hideMarketFilerDialog}
            />
          )}
        </SearchAndFilterFormContainer>

        <div className={styles.Container}>
          <SellOrdersTable
            searchFieldValue={searchFieldValue}
            sellOrderFilterValue={marketFilterValue}
            setSellOrderFilterValue={setMarketFilterValueToUrlSearchParams}
            resetSearchFieldValue={resetSearchFieldValue}
          />

          <BuyOrdersTable
            searchFieldValue={searchFieldValue}
            buyOrderFilterValue={marketFilterValue}
            setBuyOrderFilterValue={setMarketFilterValueToUrlSearchParams}
            resetSearchFieldValue={resetSearchFieldValue}
          />
        </div>
      </Main>
    </>
  )
})
