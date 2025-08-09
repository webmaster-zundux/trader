import { useCallback, useEffect, useRef, useState } from 'react'

export function useThrottleDisplayingItemsByTime<T>({
  items,
  delayInMs = 1,
  batchSize = 1,
  isTrottleOnlyNewItems = true
}: {
  items: T[]
  delayInMs?: number
  batchSize?: number
  isTrottleOnlyNewItems?: boolean
}) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([])
  const previouslyVisibleItemsAmountRef = useRef(0)
  const currentlyVisibleItemsAmountRef = useRef(0)
  const lastTimeMarkRef = useRef(0)

  const displayedItemsRef = useRef<T[]>([])
  const handleSetDisplayedItems = useCallback(function handleSetDisplayedItems(newDisplayedItems: T[]) {
    setDisplayedItems(newDisplayedItems)
    displayedItemsRef.current = newDisplayedItems
  }, [setDisplayedItems])

  useEffect(function displayItemsThrottledByTimeEffect() {
    let timeoutId: number
    const previouslyVisibleItemsLength = previouslyVisibleItemsAmountRef.current || 0

    currentlyVisibleItemsAmountRef.current = 0

    function addBatch() {
      if (currentlyVisibleItemsAmountRef.current >= items.length) {
        previouslyVisibleItemsAmountRef.current = currentlyVisibleItemsAmountRef.current
        return
      }

      const now = (new Date()).getTime()
      const timeDelta = now - lastTimeMarkRef.current
      const batchTimeout = ((timeDelta > 0) && (timeDelta < delayInMs))
        ? (timeDelta + delayInMs)
        : delayInMs

      lastTimeMarkRef.current = now + batchTimeout

      timeoutId = window.setTimeout(function displayNextItemsBatchTimeoutHandler() {
        const currentIndex = currentlyVisibleItemsAmountRef.current
        const currentBatchSize = (
          isTrottleOnlyNewItems
          && (currentIndex === 0)
          && (items.length >= previouslyVisibleItemsAmountRef.current)
        )
          ? (previouslyVisibleItemsLength || batchSize)
          : batchSize

        const nextEpochSize = currentIndex + currentBatchSize
        const nextItemsEpoch = items.slice(0, nextEpochSize)

        currentlyVisibleItemsAmountRef.current = nextItemsEpoch.length

        handleSetDisplayedItems(nextItemsEpoch)
        addBatch()
      }, batchTimeout)
    }

    addBatch()

    return function displayItemsThrottledByTimeEffectCleanup() {
      window.clearTimeout(timeoutId)
    }
  }, [delayInMs, items, handleSetDisplayedItems, batchSize, isTrottleOnlyNewItems, previouslyVisibleItemsAmountRef, currentlyVisibleItemsAmountRef, lastTimeMarkRef])

  return displayedItems
}
