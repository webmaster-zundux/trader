import { memo } from 'react'
import { Button } from '~/components/Button'
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
    show: showMapOrderPricesFilterDialog,
    hide: hideMapOrderPricesFilterDialog,
    toggle: toggleVisibilityOfMapOrderPricesFilterDialog,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleRoutePlanning,
    show: showRoutePlanning,
    hide: hideRoutePlanning,
    toggle: toggleVisibilityOfRoutePlanningDialog,
  } = useIsVisible(false)

  return (
    <>
      {(mapMode === MAP_MODE_PLANETARY_SYSTEM) && (
        <>
          <div className={styles.MapActionButtonsContainer}>
            <ul className={styles.MapActionButtons}>
              <li className={styles.MapActionButton}>
                <Button
                  noPadding
                  noBorder
                  transparent
                  title="show a product prices"
                  onClick={toggleVisibilityOfMapOrderPricesFilterDialog}
                >
                  <i className="icon icon-package_2"></i>
                  {/* <span>
                    show product prices
                  </span> */}
                </Button>
              </li>

              <li className={styles.MapActionButton}>
                <Button
                  noPadding
                  noBorder
                  transparent
                  title="route planning"
                  onClick={toggleVisibilityOfRoutePlanningDialog}
                >
                  <i className="icon icon-route"></i>
                  {/* <span>
                    plan route
                  </span> */}
                </Button>
              </li>
            </ul>
          </div>

          <div className={styles.ActionPanelsContainer}>
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

            {isVisibleRoutePlanning && (
              <div className={cn([styles.ActionPanel, styles.RoutePlanning])}>
                route planning form and results
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
})
