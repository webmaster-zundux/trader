import { memo, useEffect, useMemo } from 'react'
import { Button } from '~/components/Button'
import { TuneIcon } from '~/components/icons/TuneIcon'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import { usePageTitle } from '~/hooks/usePageTitle'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getProductNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { createLocationFullNameFromParts } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { Main } from '../../components/Main'
import { PAGE_TITLE_MARKET_WITH_SEARCH_PARAMS_FN } from './MarketPage.const'
import styles from './MarketPage.module.css'
import { getOrdersTableUrlSearchParams, useOrdersTableFilter } from './useOrdersTableFilter'
import { useOrdersTableSearch } from './useOrdersTableSearch'
import { SellOrdersTable } from './tables/SellOrdersTable'
import { BuyOrdersTable } from './tables/BuyOrdersTable'
import { MarketFilterDialog } from './modals/MarketFilterDialog'

function useLocationsPageTitle(urlSearchParams: URLSearchParams) {
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
    return createPageTitleString(PAGE_TITLE_MARKET_WITH_SEARCH_PARAMS_FN({
      productName: searchingProductName,
      locationName: searchingLocationFullName,
    }))
  }, [searchingProductName, searchingLocationFullName])

  usePageTitle(pageTitle)
}

export const MarketPage = memo(function MarketPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const {
    marketFilterValue,
    setMarketFilterValueToUrlSearchParams,
  } = useOrdersTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  } = useOrdersTableSearch({ urlSearchParams, setUrlSearchParams })

  useLocationsPageTitle(urlSearchParams)

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
    <Main>
      <div className={styles.SearchAndFilterFormContainer}>

        {SearchForm}

        <Button onClick={showMarketFilterDialog} title="show filter form">
          <TuneIcon />
          <span>filter</span>
        </Button>

        {isVisibleMarketFilterDialog && (
          <MarketFilterDialog
            filterValue={marketFilterValue}
            onSetFilterValue={setMarketFilterValueToUrlSearchParams}
            onHide={hideMarketFilerDialog}
          />
        )}
      </div>

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
  )
})
