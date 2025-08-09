import { useCallback, useEffect, useMemo, useState } from 'react'
import type { OrderBaseFilter } from '~/models/entities-filters/OrderBaseFilter'
import type { Entity } from '../../../models/Entity'
import { ModalConfirmation } from '../../modals/confirmations/ModalConfirmation'

interface UseItemsSelectingProps<
  T extends Entity = Entity,
> {
  itemTypeNamePlural: string
  items: T[]
  searchFieldValue?: string
  filterValue?: OrderBaseFilter
  deleteItemsByUuids: (itemsIdsToDelete: string[]) => void
  setItemToDelete: (itemToDelete: T) => void
}

export function useItemsSelecting<
  T extends Entity = Entity,
>({
  itemTypeNamePlural = 'items',
  items = [],
  searchFieldValue,
  filterValue,
  deleteItemsByUuids,
  setItemToDelete,
}: UseItemsSelectingProps<T>) {
  const [selectedItemsUuids, setSelectedItemsUuids] = useState<Entity['uuid'][]>([])

  const handleSelectItem = useCallback(function handleSelectItem(
    itemToSelect: T,
    selected: boolean
  ) {
    setSelectedItemsUuids((prevSelectedItemsUuids) => {
      if (selected) {
        return Array.from(new Set((new Array<string>()).concat(prevSelectedItemsUuids, itemToSelect.uuid)))
      }

      return prevSelectedItemsUuids.filter(existingUuid => existingUuid !== itemToSelect.uuid)
    })
  }, [setSelectedItemsUuids])

  const handleResetSelectedItems = useCallback(() => {
    setSelectedItemsUuids((prevSelectedItemsUuids) => {
      if (!prevSelectedItemsUuids.length) {
        return prevSelectedItemsUuids
      }

      return []
    })
  }, [])

  const handleSelectAllItems = useCallback(function handleSelectAllItems() {
    if (selectedItemsUuids.length !== items.length) {
      setSelectedItemsUuids(items.map(item => item.uuid))
      return
    }

    handleResetSelectedItems()
  }, [selectedItemsUuids, items, handleResetSelectedItems])

  const handleDeleteSelectedItems = useCallback(function handleDeleteSelectedItems() {
    deleteItemsByUuids(selectedItemsUuids)
    handleResetSelectedItems()
  }, [deleteItemsByUuids, selectedItemsUuids, handleResetSelectedItems])

  const handleShowDeleteSingleBuyItemConfirmation = useCallback((itemToDelete: T) => {
    setItemToDelete(itemToDelete)
  }, [setItemToDelete])

  const [isShowDeleteSelectedItemsConfirmation, setIsShowDeleteSelectedItemsConfirmation] = useState(false)

  const handleShowDeleteMultipleSelectedItemsConfirmation = useCallback(function handleShowDeleteMultipleSelectedItemsConfirmation() {
    if (!selectedItemsUuids.length) {
      return
    }

    if (selectedItemsUuids.length === 1) {
      const selectedItemUuid = selectedItemsUuids[0]
      const existingSellItemToDelete = items.find(sellItem => sellItem.uuid === selectedItemUuid)

      if (!existingSellItemToDelete) {
        return
      }

      handleShowDeleteSingleBuyItemConfirmation(existingSellItemToDelete)
      return
    }

    setIsShowDeleteSelectedItemsConfirmation(true)
  }, [selectedItemsUuids, items, handleShowDeleteSingleBuyItemConfirmation])

  const handleHideDeleteSelectedMultipleItemsConfirmation = useCallback(function handleHideDeleteSelectedMultipleItemsConfirmation() {
    setIsShowDeleteSelectedItemsConfirmation(false)
  }, [])

  useEffect(function removesSelectedUuidsOfItemsThoseNotExistInItemsEffect() {
    setSelectedItemsUuids((prevSelectedItemsUuids) => {
      if (!prevSelectedItemsUuids.length) {
        return prevSelectedItemsUuids
      }

      const itemsUuids: string[] = []

      items.forEach((item) => {
        const id = prevSelectedItemsUuids.find(itemUuid => itemUuid === item.uuid)

        if (id) {
          itemsUuids.push(id)
        }
      })

      return itemsUuids
    })
  }, [items])

  const renderDeleteMultipleItemsConfirmationTitle = useMemo(function renderDeleteMultipleItemsConfirmationTitleMemo() {
    if (selectedItemsUuids.length > 1) {
      return (
        <>
          are sure you want to delete
          {' '}
          <strong>{selectedItemsUuids.length}</strong>
          {' '}
          {itemTypeNamePlural}
          ?
        </>
      )
    }
  }, [selectedItemsUuids.length, itemTypeNamePlural])

  const DeleteSelectedItemsConfirmation = useMemo(function DeleteSelectedItemsConfirmation() {
    return function DeleteSelectedItemsConfirmation() {
      return (
        <>
          {isShowDeleteSelectedItemsConfirmation && (
            <ModalConfirmation
              title={renderDeleteMultipleItemsConfirmationTitle}
              onHide={handleHideDeleteSelectedMultipleItemsConfirmation}
              onConfirm={handleDeleteSelectedItems}
              confirmButtonLabel={`delete multiple ${itemTypeNamePlural}`}
            />
          )}
        </>
      )
    }
  }, [isShowDeleteSelectedItemsConfirmation, itemTypeNamePlural, renderDeleteMultipleItemsConfirmationTitle, handleHideDeleteSelectedMultipleItemsConfirmation, handleDeleteSelectedItems])

  useEffect(function clearsSelectedUuidsWhenSearchTermOrFilterValueChangesEffect() {
    if (
      (searchFieldValue || !searchFieldValue)
      || (filterValue || !filterValue)
    ) {
      handleResetSelectedItems()
    }
  }, [searchFieldValue, filterValue, handleResetSelectedItems])

  return {
    selectedItemsUuids,

    handleSelectItem,
    handleSelectAllItems,
    handleResetSelectedItems,

    handleShowDeleteMultipleSelectedItemsConfirmation,

    DeleteSelectedItemsConfirmation,
  }
}
