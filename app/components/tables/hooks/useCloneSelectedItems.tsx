import { useCallback, useState } from 'react'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import type { Entity } from '../../../models/Entity'
import { Button } from '../../Button'
import { ModalCopyingItemsForm } from '../../forms/ModalCopyingItemsForm'
import { ModalNotification } from '../../modals/notifications/ModalNotification'
import styles from './useCloneSelectedItems.module.css'
import { Icon } from '~/components/Icon'

interface UseCloneSelectedItemsProps<
  T extends Entity = Entity,
> {
  items: T[]
  selectedItemsUuids: Entity['uuid'][]

  itemTypeName?: string
  itemTypePluralName?: string

  targetTableName?: string

  onBulkCopyingIntoTargetTable: (items: T[]) => void
  findSimilarItemInTargetTable: (item: T) => T | undefined
}
export function useCloneSelectedItems<
  T extends Entity = Entity,
>({
  items,
  selectedItemsUuids,

  itemTypeName = 'item',
  itemTypePluralName = 'items',

  targetTableName = undefined,

  onBulkCopyingIntoTargetTable,
  findSimilarItemInTargetTable,
}: UseCloneSelectedItemsProps<T>) {
  const [notExistingInTargetTableSeletectItems, setSelectedItems] = useState<T[]>()
  const [addedItems, setAddedItems] = useState<T[]>([])

  const {
    isVisible: isVisibleCopyingDialog,
    show: showCopyingDialog,
    hide: hideCopyingDialog,
  } = useIsVisible(false)

  const {
    isVisible: isVisibleNothingToAddNotification,
    show: showNothingToAddNotification,
    hide: hideNothingToAddNotification,
  } = useIsVisible(false)

  const handleShowCopyingDialog = useCallback(() => {
    const newSelectedItems = items
      .filter(item => selectedItemsUuids.includes(item.uuid))

    const notExistingInTargetTableSelectedItems = newSelectedItems
      .filter(selectedItem => !findSimilarItemInTargetTable(selectedItem))

    if (!notExistingInTargetTableSelectedItems.length) {
      showNothingToAddNotification()
      setSelectedItems(undefined)
      return
    }

    setSelectedItems(notExistingInTargetTableSelectedItems)
    showCopyingDialog()
  }, [items, selectedItemsUuids, setSelectedItems, showCopyingDialog, showNothingToAddNotification, findSimilarItemInTargetTable])

  const handleHideCopyingDialog = useCallback(() => {
    hideCopyingDialog()

    setSelectedItems(undefined)
  }, [hideCopyingDialog, setSelectedItems])

  const {
    isVisible: isVisibleItemsWereAddedNotification,
    show: showItemsWereAddedNotification,
    hide: hideItemsWereAddedNotification,
  } = useIsVisible(false)

  const handleSubmit = useCallback((approvedItems: T[]) => {
    onBulkCopyingIntoTargetTable(approvedItems)
    setAddedItems(approvedItems)
    handleHideCopyingDialog()
    showItemsWereAddedNotification()
  }, [onBulkCopyingIntoTargetTable, setAddedItems, handleHideCopyingDialog, showItemsWereAddedNotification])

  const CopySelectedItemsButton = useCallback(() => {
    const buttonTitle = `copy selected ${(selectedItemsUuids.length > 1) ? itemTypePluralName : itemTypeName} ${!!targetTableName && (`into ${targetTableName}`)}`

    return (
      <>
        {(!!(selectedItemsUuids?.length)) && (
          <Button
            noPadding
            transparent
            title={buttonTitle}
            onClick={handleShowCopyingDialog}
          >
            <Icon name="content_copy" />
          </Button>
        )}
      </>
    )
  }, [selectedItemsUuids, itemTypePluralName, itemTypeName, targetTableName, handleShowCopyingDialog])

  const CopyingDialog = useCallback(() => {
    return (
      <>
        {(isVisibleCopyingDialog) && (
          <ModalCopyingItemsForm
            title={`copy selected items ${targetTableName ? `into ${targetTableName}` : ''}`}
            itemsToCreate={notExistingInTargetTableSeletectItems}
            onCancel={handleHideCopyingDialog}
            onBulkCreate={handleSubmit}
          />
        )}
      </>
    )
  }, [isVisibleCopyingDialog, handleHideCopyingDialog, handleSubmit, notExistingInTargetTableSeletectItems, targetTableName])

  const NothingToCopyNotification = useCallback(() => {
    return (
      <>
        {isVisibleNothingToAddNotification && (
          <ModalNotification
            title="No more items can be added"
            onHide={hideNothingToAddNotification}
            okButtonLabel="ok"
          >
            <p className={styles.Message}>
              there are already a duplicate item for every original item
            </p>
          </ModalNotification>
        )}
      </>
    )
  }, [isVisibleNothingToAddNotification, hideNothingToAddNotification])

  const handleHideWereAddedNotification = useCallback(() => {
    hideItemsWereAddedNotification()
    setAddedItems([])
  }, [hideItemsWereAddedNotification, setAddedItems])

  const ItemsWereCopiedNotification = useCallback(() => {
    const title = (addedItems.length > 1) ? 'items were added:' : 'item was added:'

    return (
      <>
        {isVisibleItemsWereAddedNotification && (
          <ModalNotification
            title={title}
            onHide={handleHideWereAddedNotification}
            okButtonLabel="ok"
          >
            <ul style={{
              listStyle: 'none',
              padding: 0,
              textAlign: 'left',
              margin: '1em 0',
              maxHeight: '90%',
              overflow: 'auto'
            }}
            >
              {addedItems.map((addedItem, index) => (
                <li key={index} style={{ padding: 0 }}>
                  -
                  {' '}
                  {addedItem.entityType}
                  {' '}
                  {/* @ts-expect-error - optional attribute 'name' */}
                  {addedItem?.name || ''}
                </li>
              ))}
            </ul>
          </ModalNotification>
        )}
      </>
    )
  }, [isVisibleItemsWereAddedNotification, handleHideWereAddedNotification, addedItems])

  return {
    CopySelectedItemsButton,
    CopyingDialog,
    NothingToCopyNotification,
    ItemsWereCopiedNotification,
  }
}
