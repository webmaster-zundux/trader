import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EntityBaseFilter } from '~/models/entities-filters/EntityBaseFilter'
import type { Entity } from '../../../models/Entity'
import { useLastCreatedOrUpdatedItemStore } from '../../../stores/simple-stores/LastCreatedOrUpdatedItem.store'

const ANIMATION_DURATION_OF_HIGHLIGHTING_TABLE_ROW_FOR_LAST_CREATED_OR_EDITED_ITEM_IN_MS = 5 * 1000 // must be a multiple of animation-duration in .HighlightRow

interface UseResetOfSearchAndFilterWhenTableRowIsNotVisibleProps<
  T extends Entity = Entity,
  F extends EntityBaseFilter = EntityBaseFilter
> {
  itemEntityType: Exclude<Entity['entityType'], undefined>
  items: T[]
  searchFieldValue?: string
  filterValue?: F
  resetSearchFieldValue?: () => void
  resetFilterValue?: () => void
}
export function useResetOfSearchAndFilterWhenLastCreatedOrUpdatedItemIsNotVisibleAsTableRow<
  T extends Entity = Entity,
  F extends EntityBaseFilter = EntityBaseFilter
>({
  itemEntityType,
  items,
  searchFieldValue,
  filterValue,
  resetSearchFieldValue,
  resetFilterValue,
}: UseResetOfSearchAndFilterWhenTableRowIsNotVisibleProps<T, F>) {
  const lastCreatedOrUpdatedItemWithAnyType = useLastCreatedOrUpdatedItemStore(state => state.item)
  const setLastCreatedOrUpdatedItem = useLastCreatedOrUpdatedItemStore(state => state.setItem)

  const lastCreatedOrUpdatedItem = useMemo(function lastCreatedOrUpdatedItemMemo() {
    return lastCreatedOrUpdatedItemWithAnyType?.entityType === itemEntityType
      ? lastCreatedOrUpdatedItemWithAnyType as T
      : undefined
  }, [lastCreatedOrUpdatedItemWithAnyType, itemEntityType])

  const handleCreateItem = useCallback(function handleCreateItem(item: T) {
    setLastCreatedOrUpdatedItem(item)
  }, [setLastCreatedOrUpdatedItem])

  const handleUpdateItem = useCallback(function handleUpdateItem(item: T) {
    setLastCreatedOrUpdatedItem(item)
  }, [setLastCreatedOrUpdatedItem])

  const handleResetSearchFieldValue = useCallback(function handleResetSearchFieldValue() {
    if (!resetSearchFieldValue) {
      return
    }

    resetSearchFieldValue()
  }, [resetSearchFieldValue])

  const handleResetFilterValue = useCallback(function handleResetFilterValue() {
    if (!resetFilterValue) {
      return
    }

    resetFilterValue()
  }, [resetFilterValue])

  const [lastSearchFieldValue, setLastSearchFieldValue] = useState<string | undefined>(undefined)
  const [lastFilterValue, setLastFilterValue] = useState<F | undefined>(undefined)

  useEffect(function resetLastCreatedOrUpdatedItemWhenSearchFieldValueOrFilterValueChangesEffect() {
    if (
      (!Object.is(searchFieldValue, lastSearchFieldValue))
      || (!Object.is(filterValue, lastFilterValue))
    ) {
      setLastCreatedOrUpdatedItem(undefined)

      if (!Object.is(searchFieldValue, lastSearchFieldValue)) {
        setLastSearchFieldValue(searchFieldValue)
      }

      if (!Object.is(filterValue, lastFilterValue)) {
        setLastFilterValue(filterValue)
      }
    }

    return function resetLastCreatedOrUpdatedItemWhenTableThatUsesTheHookUnmountsEffectCleanup() {
      if (!lastCreatedOrUpdatedItem) {
        return
      }

      if (items.find(item => item.uuid === lastCreatedOrUpdatedItem.uuid)) {
        setLastCreatedOrUpdatedItem(undefined)
      }
    }
  }, [lastSearchFieldValue, lastFilterValue, searchFieldValue, filterValue, setLastCreatedOrUpdatedItem, setLastSearchFieldValue, setLastFilterValue, items, lastCreatedOrUpdatedItem])

  useEffect(function resetSearchFieldValueAndFilterValueIfLastCreatedOrUpdatedItemIsNotVisibleEffect() {
    if (!lastCreatedOrUpdatedItem) {
      return
    }

    const isVisibleItem = items.find(existingItem => existingItem.uuid === lastCreatedOrUpdatedItem.uuid)

    if (!isVisibleItem) {
      if (filterValue) {
        handleResetFilterValue()
      }

      if (searchFieldValue) {
        handleResetSearchFieldValue()
      }

      return
    }

    const timeoutId = window.setTimeout(function removeLastCreatedOrUpdatedItemTimeoutHandler() {
      setLastCreatedOrUpdatedItem(undefined)
    }, ANIMATION_DURATION_OF_HIGHLIGHTING_TABLE_ROW_FOR_LAST_CREATED_OR_EDITED_ITEM_IN_MS)

    return function resetSearchFieldValueAndFilterValueIfLastCreatedOrUpdatedItemIsNotVisibleEffectCleanup() {
      window.clearTimeout(timeoutId)
    }
  }, [lastCreatedOrUpdatedItem, items, handleResetFilterValue, handleResetSearchFieldValue, filterValue, searchFieldValue, setLastCreatedOrUpdatedItem])

  return {
    lastCreatedOrUpdatedItem,
    onCreateItem: handleCreateItem,
    onUpdateItem: handleUpdateItem,
  }
}
