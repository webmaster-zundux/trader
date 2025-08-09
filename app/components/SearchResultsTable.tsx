import { memo, useRef, type PropsWithChildren } from 'react'
import { useThrottleDisplayingItemsByTime } from '~/hooks/useThrottleDisplayingItemsByTime'
import { useDoesElementHaveVisibleScrollbars } from '../hooks/ui/useDoesElementHaveVisibleScrollbars'
import type { Entity } from '../models/Entity'
import { cn } from '../utils/ui/ClassNames'
import styles from './SearchResultsTable.module.css'
import { TableCellAsLabel, TableRow, type Column } from './Table'

interface SearchResultsTableRowWithLabelsAsButtonProps<
  P extends Entity = Entity,
> {
  item: P
  columns: Column<P>[]
  onSelectItem?: (item: P) => void
  isHighlightRow?: boolean
}
const SearchResultsTableRowWithLabelsAsButton = memo(function SearchResultsTableRowWithLabelsAsButtonMemo<
  P extends Entity = Entity,
>({
  item,
  columns,
  onSelectItem,
  isHighlightRow,
}: SearchResultsTableRowWithLabelsAsButtonProps<P>) {
  return (
    <TableRow
      isHighlightRow={isHighlightRow}
      isHighlightRowBlinking={false}
    >
      {columns.map((column, columnIndex) => {
        return (
          <TableCellAsLabel
            key={column.name}
            item={item}
            column={column}
            columnIndex={columnIndex}
            onSelectItem={onSelectItem}
          />
        )
      })}
    </TableRow>
  )
})

interface SearchResultsTableBodyProps<T extends Entity = Entity> {
  items: T[]
  columns: Column<T>[]
  onSelectItem?: (itemToSelect: T) => void
  selectedItemUuid?: T['uuid']
}
export const SearchResultsTableBody = memo(function SearchResultsTableBody<
  T extends Entity = Entity
>({
  items,
  columns,
  onSelectItem = () => undefined,
  selectedItemUuid,
}: SearchResultsTableBodyProps<T>) {
  const displayingItemsThrottledByTime = useThrottleDisplayingItemsByTime({ items })

  return (
    <>
      {displayingItemsThrottledByTime.map(item => (
        <SearchResultsTableRowWithLabelsAsButton
          key={item.uuid}
          item={item}
          columns={columns}
          onSelectItem={onSelectItem}
          isHighlightRow={selectedItemUuid === item.uuid}
        />
      ))}
    </>
  )
})

interface SearchResultsTableProps<T extends Entity = Entity> extends PropsWithChildren {
  tableTitle: string
  items: T[]
  noItemsLabel?: string
  isLoading?: boolean
  loadingLabel?: string
  itemTypeName?: string
  itemTypeNamePlural?: string

  searchFieldValue?: string

  filterValue?: { [key: string]: string | number | undefined }
}
export const SearchResultsTable = memo(function SearchResultsTableMemo<T extends Entity = Entity>({
  tableTitle = 'Table',
  items = [],
  noItemsLabel = 'no data',
  isLoading = false,
  loadingLabel = 'loading data...',
  itemTypeName = 'item',
  itemTypeNamePlural = 'items',

  searchFieldValue,

  filterValue,

  children,
}: SearchResultsTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { vertical } = useDoesElementHaveVisibleScrollbars(tableContainerRef, items)

  const tableContainerClassNames = cn([
    styles.TableContainer,
    vertical && styles.TableContainerWithVisibleScrollbar,
  ])

  return (
    <div className={styles.TableWrapper}>

      <div className={styles.TableHeaderContainer}>
        <div className={styles.TableHeaderLeftPart}>
          <h2 className={styles.TableTitle}>
            {tableTitle}
          </h2>
          <div className={styles.TableTitleActonButtons}>

          </div>
        </div>

        <div className={styles.TableHeaderRightPart}>
          <div className={styles.TableItemsQuantity}>
            {(
              !!(filterValue)
              || !!(searchFieldValue)
            )
              ? `found`
              : `total`}
            {' '}
            {items.length}
            {' '}
            {((items.length > 1) || (items.length === 0)) ? itemTypeNamePlural : itemTypeName}
          </div>

        </div>
      </div>

      <div ref={tableContainerRef} className={tableContainerClassNames}>
        <table className={styles.Table}>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={100}
                  rowSpan={100}
                  className={styles.LoadingData}
                >
                  {loadingLabel}
                </td>
              </tr>
            )}

            {!isLoading && !items.length && (
              <tr>
                <td
                  colSpan={100}
                  rowSpan={100}
                  className={styles.NoData}
                >
                  {noItemsLabel}
                </td>
              </tr>
            )}

            {!isLoading && !!items.length && children}

          </tbody>
        </table>
      </div>
    </div>
  )
})
