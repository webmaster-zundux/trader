import { memo } from 'react'
import styles from './MapStaticOverlayActionButtons.module.css'
import { MAP_MODE_PLANETARY_SYSTEM, type MapMode } from './Map.const'
import { Button } from '~/components/Button'
import { Package2Icon } from '~/components/icons/Package2Icon'
import { RouteIcon } from '~/components/icons/RouteIcon'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import { cn } from '~/utils/ui/ClassNames'
import { MapOrderPricesFilterDialog } from './modal/MapOrderPricesFilterDialog'
import { useMapOrderPricesTableFilter } from './useMapOrderPricesTableFilter'
import { useSearchParams } from '~/hooks/useSearchParams'

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
                  size="small"
                  noPadding
                  noBorder
                  transparent
                  title="show a product prices"
                  onClick={toggleVisibilityOfMapOrderPricesFilterDialog}
                >
                  <Package2Icon />
                  {/* <span>
                    show product prices
                  </span> */}
                </Button>
              </li>

              <li className={styles.MapActionButton}>
                <Button
                  size="small"
                  noPadding
                  noBorder
                  transparent
                  title="route planning"
                  onClick={toggleVisibilityOfRoutePlanningDialog}
                >
                  <RouteIcon />
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
                {/* product search form and results */}
                <MapOrderPricesFilterDialog
                  filterValue={mapOrderPricesFilterValue}
                  onSetFilterValue={setMapOrderPricesFilterValueToUrlSearchParams}
                  onHide={hideMapOrderPricesFilterDialog}
                />
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
