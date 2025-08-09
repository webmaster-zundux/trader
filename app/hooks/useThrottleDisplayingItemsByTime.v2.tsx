import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_QUANTITY_OF_CHANGED_ITEMS_TO_IGNORE = 5

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

  const itemsToDisplayRef = useRef<T[]>([])
  const [timemarkToThrottleItemsDisplaying, setTimemarkToThrottleItemsDisplaying] = useState(0)
  const displayedItemsRef = useRef<T[]>([])

  const handleSetDisplayedItems = useCallback(function handleSetDisplayedItems(newDisplayedItems: T[]) {
    setDisplayedItems(newDisplayedItems)
    displayedItemsRef.current = newDisplayedItems
  }, [setDisplayedItems])

  const handleSetItemsToDisplay = useCallback(function handleSetItemsToDisplay(newItemsToDisplay: T[]) {
    itemsToDisplayRef.current = newItemsToDisplay
    setTimemarkToThrottleItemsDisplaying(new Date().getTime())
  }, [itemsToDisplayRef, setTimemarkToThrottleItemsDisplaying])

  useEffect(function setDisplayedItemsOnTimemarkToThrottleItemsToDisplayingChageEffect() {
    const itemsToDisplay = itemsToDisplayRef.current

    handleSetDisplayedItems(itemsToDisplay)
  }, [timemarkToThrottleItemsDisplaying, handleSetDisplayedItems])

  useEffect(function itemsChangesEffect() {
    const currentlyDisplayedItems = displayedItemsRef.current

    if (Object.is(items, currentlyDisplayedItems)) {
      return
    }

    if (items.length > currentlyDisplayedItems.length) {
      handleSetItemsToDisplay(items)
      return
    }

    if (items.length <= currentlyDisplayedItems.length) {
      let changedItems = 0

      currentlyDisplayedItems.forEach((currentlyDisplayedItem) => {
        const existingAlreadyDisplayedItem = items.find(item => Object.is(item, currentlyDisplayedItem))

        if (existingAlreadyDisplayedItem) {
          changedItems++
        }
      })

      if (changedItems > MAX_QUANTITY_OF_CHANGED_ITEMS_TO_IGNORE) {
        handleSetItemsToDisplay(items)
        return
      }
    }

    handleSetDisplayedItems(items)
  }, [items, handleSetItemsToDisplay, handleSetDisplayedItems, displayedItemsRef])

  useEffect(function displayItemsThrottledByTimeEffect() {
    let timeoutId: number
    const previouslyVisibleItemsLength = previouslyVisibleItemsAmountRef.current || 0
    const itemsToDisplay = itemsToDisplayRef.current

    currentlyVisibleItemsAmountRef.current = 0

    function addBatch() {
      if (currentlyVisibleItemsAmountRef.current >= itemsToDisplay.length) {
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
          && (itemsToDisplay.length >= previouslyVisibleItemsAmountRef.current)
        )
          ? (previouslyVisibleItemsLength || batchSize)
          : batchSize

        const nextEpochSize = currentIndex + currentBatchSize
        const nextItemsEpoch = itemsToDisplay.slice(0, nextEpochSize)

        currentlyVisibleItemsAmountRef.current = nextItemsEpoch.length

        handleSetDisplayedItems(nextItemsEpoch)
        addBatch()
      }, batchTimeout)
    }

    addBatch()

    return function displayItemsThrottledByTimeEffectCleanup() {
      window.clearTimeout(timeoutId)
    }
  }, [delayInMs, itemsToDisplayRef, handleSetDisplayedItems, batchSize, isTrottleOnlyNewItems, previouslyVisibleItemsAmountRef, currentlyVisibleItemsAmountRef, lastTimeMarkRef])

  return displayedItems
}
