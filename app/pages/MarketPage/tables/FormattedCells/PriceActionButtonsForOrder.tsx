import { useCallback } from 'react'
import { Button } from '~/components/Button'
import { BidLandscapeDisabledIcon } from '~/components/icons/BidLandscapeDisabledIcon'
import { MonitoringIcon } from '~/components/icons/MonitoringIcon'
import type { Order } from '~/models/Order'
import { hasEnoughDataForPriceHistoryPlotForOrderSelector, usePriceHistoriesStore } from '~/stores/entity-stores/PriceHistories.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'

export function PriceActionButtonsForOrder({
  item,
  setOrderForPriceChart,
}: {
  item: Order
  setOrderForPriceChart: (item: Order) => void
}) {
  const isLoading = useLoadingPersistStorages([usePriceHistoriesStore])

  const handleSetOrderForPriceChart = useCallback(function handleSetOrderForPriceChart() {
    setOrderForPriceChart(item)
  }, [item, setOrderForPriceChart])

  const hasChartData = !isLoading && hasEnoughDataForPriceHistoryPlotForOrderSelector(item.uuid)

  return (
    <>
      {hasChartData
        ? (
            <Button
              transparent
              noPadding
              noBorder
              isAlwaysVisible
              onClick={handleSetOrderForPriceChart}
              title="show price chart"
            >
              <MonitoringIcon />
            </Button>
          )
        : (
            <Button
              transparent
              noPadding
              noBorder
              isStaticBehaviour
              title="no price data"
              disabled
            >
              <BidLandscapeDisabledIcon />
            </Button>
          )}
    </>
  )
}
