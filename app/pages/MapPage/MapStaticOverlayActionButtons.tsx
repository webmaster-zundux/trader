import { memo } from 'react'
import { Button } from '~/components/Button'
import { Icon } from '~/components/Icon'
import { FEATURE_ACTIVE_MAP_HIGHLIGHT_PRODUCT_PRICE, FEATURE_ACTIVE_MAP_ROUTE_PLANNER } from '~/feature.list'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import { useSearchParams } from '~/hooks/useSearchParams'
import { cn } from '~/utils/ui/ClassNames'
import { MAP_MODE_PLANETARY_SYSTEM, type MapMode } from './Map.const'
import styles from './MapStaticOverlayActionButtons.module.css'
import { MapOrderPricesFilterDialog } from './modal/MapOrderPricesFilterDialog'
import { MapSellOrderPricesTable } from './tables/MapSellOrderPricesTable'
import { useMapOrderPricesTableFilter } from './useMapOrderPricesTableFilter'

interface MapStaticOverlayActionButtonsProps {
  mapMode: MapMode
}
export const MapStaticOverlayActionButtons = memo(function MapStaticOverlayActionButtons({
  mapMode,
}: MapStaticOverlayActionButtonsProps) {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const {
    mapOrderPricesFilterValue,
    setMapOrderPricesFilterValueToUrlSearchParams,
  } = useMapOrderPricesTableFilter({ urlSearchParams, setUrlSearchParams })

  const {
    isVisible: isVisibleMapOrderPricesFilterDialog,
    // show: showMapOrderPricesFilterDialog,
    hide: hideMapOrderPricesFilterDialog,
    toggle: toggleVisibilityOfMapOrderPricesFilterDialog,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleRoutePlanning,
    // show: showRoutePlanning,
    // hide: hideRoutePlanning,
    toggle: toggleVisibilityOfRoutePlanningDialog,
  } = useIsVisible(false)

  return (
    <>
      {(mapMode === MAP_MODE_PLANETARY_SYSTEM) && (
        <>
          <div className={styles.MapActionButtonsContainer}>
            <ul className={styles.MapActionButtons}>
              {FEATURE_ACTIVE_MAP_HIGHLIGHT_PRODUCT_PRICE && (
                <li className={styles.MapActionButton}>
                  <Button
                    noPadding
                    noBorder
                    transparent
                    title="show a product prices"
                    onClick={toggleVisibilityOfMapOrderPricesFilterDialog}
                  >
                    <Icon name="package_2" />
                    {/* <span>
                    show product prices
                  </span> */}
                  </Button>
                </li>
              )}

              {FEATURE_ACTIVE_MAP_ROUTE_PLANNER && (
                <li className={styles.MapActionButton}>
                  <Button
                    noPadding
                    noBorder
                    transparent
                    title="route planning"
                    onClick={toggleVisibilityOfRoutePlanningDialog}
                  >
                    <Icon name="route" />
                    {/* <span>
                    plan route
                  </span> */}
                  </Button>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.ActionPanelsContainer}>
            {FEATURE_ACTIVE_MAP_HIGHLIGHT_PRODUCT_PRICE && (
              <>
                {isVisibleMapOrderPricesFilterDialog && (
                  <div className={cn([styles.ActionPanel, styles.ProductSearch])}>
                    {/* order filter form and results */}
                    <MapOrderPricesFilterDialog
                      filterValue={mapOrderPricesFilterValue}
                      onSetFilterValue={setMapOrderPricesFilterValueToUrlSearchParams}
                      onHide={hideMapOrderPricesFilterDialog}
                    />

                    <div className={styles.ActionPanelResultsContainer}>
                      <MapSellOrderPricesTable
                        sellOrderFilterValue={mapOrderPricesFilterValue}
                      // setSellOrderFilterValue={setMapOrderPricesFilterValueToUrlSearchParams}
                      />

                      {/* <SellOrdersTable
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
                  /> */}
                    </div>
                  </div>
                )}
              </>
            )}

            {FEATURE_ACTIVE_MAP_ROUTE_PLANNER && (
              <>
                {isVisibleRoutePlanning && (
                  <div className={cn([styles.ActionPanel, styles.RoutePlanning])}>
                    route planning form and results
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
})
