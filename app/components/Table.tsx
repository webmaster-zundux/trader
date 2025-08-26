import type React from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, type Dispatch, type MouseEventHandler, type PropsWithChildren, type ReactNode, type SetStateAction } from 'react'
import { useThrottleDisplayingItemsByTime } from '~/hooks/useThrottleDisplayingItemsByTime'
import { useDoesElementHaveVisibleScrollbars } from '../hooks/ui/useDoesElementHaveVisibleScrollbars'
import type { Entity } from '../models/Entity'
import { cn } from '../utils/ui/ClassNames'
import { isHtmlElementVisibleInScrollableContainer } from '../utils/ui/isHtmlElementVisibleInScrollableContainer'
import { Button } from './Button'
import styles from './Table.module.css'
import { TableFilterInfo, type FilterInfoField, type FilterValue } from './TableSelectedFilterInfo'
import { COLUMN_SORT_ASC, COLUMN_SORT_DESC, COLUMN_SORT_NONE, getNextColumnSortDirection, type ColumnSortingDirection } from './tables/utils/columnSorting'
import { isCheckboxColumn } from './tables/utils/isCheckboxColumn'
import { isLinkToEditItemColumn } from './tables/utils/isLinkToEditItemColumn'

export const NoDataCell = function NoDataCell({
  children
}: PropsWithChildren) {
  return (
    <span className={styles.NoDataCell}>
      {children}
    </span>
  )
}

export type FilterParametersLabels = { [key: string]: string | undefined }

export interface TableHeaderCellAsCheckboxProps {
  areAllItemsSelected: boolean
  onSelectAllItems?: (areAllItemsSelected: boolean) => void
}
export const TableHeaderCellAsCheckbox = memo(function TableHeaderCellAsCheckbox({
  areAllItemsSelected = false,
  onSelectAllItems,
}: TableHeaderCellAsCheckboxProps) {
  const handleSelectAllItems = useCallback(function handleSelectAllItems() {
    if (typeof onSelectAllItems !== 'function') {
      return
    }

    onSelectAllItems(!areAllItemsSelected)
  }, [onSelectAllItems, areAllItemsSelected])

  return (
    <th className={cn([styles.HeaderCell, styles.HeaderCellCheckbox])}>
      <div className={styles.HeaderCellContentWrapper}>
        <div className={styles.HeaderCellLabel}>
          <input
            type="checkbox"
            name="all"
            checked={areAllItemsSelected}
            onChange={handleSelectAllItems}
          />
        </div>
      </div>
    </th>
  )
})

export interface TableHeaderCellProps<
  T extends Entity = Entity,
> {
  column: ColumnWithValue<T>
  columnsToSortBy: ColumnWithValue<T>[]
  align?: 'left' | 'center' | 'right'
  onColumnHeaderClick?: (column: Column<T>, sortDirection: ColumnSortingDirection) => void
}
export const TableHeaderCell = memo(function TableHeaderCell<
  T extends Entity = Entity,
>({
  column,
  columnsToSortBy,
  align = 'center',
  onColumnHeaderClick,
}: TableHeaderCellProps<T>) {
  const cellClassName = cn([
    styles.HeaderCell,
    (
      (align === 'left' && styles.HeaderCellAlignToLeft)
      || ((!align || (align === 'center')) && styles.HeaderCellAlignToCenter)
      || (align === 'right' && styles.HeaderCellAlignToRight)
    ),
  ])

  const columnSortDirection = useMemo(function columnSortDirectionMemo() {
    const currentColumnForSorting = columnsToSortBy.find(columnToSortBy => columnToSortBy.name === column.name)

    return currentColumnForSorting?.sort
  }, [column, columnsToSortBy])

  const sortingIconClassNames = cn([
    styles.HeaderCellSortingIcon,
    (columnSortDirection === COLUMN_SORT_ASC) && styles.AscDirectionIcon,
    (columnSortDirection === COLUMN_SORT_DESC) && styles.DescDirectionIcon,
  ])

  const handleColumnHeaderClick = useCallback(function handleColumnHeaderClick() {
    if (!column.isSortable) {
      return
    }

    if (typeof onColumnHeaderClick !== 'function') {
      return
    }

    const nextSortDirection = getNextColumnSortDirection(columnSortDirection)

    onColumnHeaderClick(column, nextSortDirection)
  }, [column, onColumnHeaderClick, columnSortDirection])

  const isActiveButton = column.isSortable && (typeof onColumnHeaderClick === 'function')

  return (
    <th className={cellClassName}>
      <Button
        transparentOnDefaultState
        fluid
        noBorder
        noPadding
        noCapitalize
        onClick={handleColumnHeaderClick}
        disabled={!isActiveButton}
      >
        <div className={styles.HeaderCellContentWrapper}>
          <div className={styles.HeaderCellLabel}>
            {column.label ?? column.name}
          </div>
          {(
            column.isSortable && (
              (columnSortDirection !== COLUMN_SORT_NONE)
              && (columnSortDirection !== undefined)
            )
          ) && (
            <div className={sortingIconClassNames}>
              {(columnSortDirection === COLUMN_SORT_ASC) && '⯅'}
              {(columnSortDirection === COLUMN_SORT_DESC) && '⯆'}
            </div>
          )}
        </div>
      </Button>
    </th>
  )
})

export interface TableCellProps extends PropsWithChildren {
  onClick?: MouseEventHandler<HTMLButtonElement>
  align?: 'left' | 'center' | 'right'
  asLink?: boolean
  capitalize?: boolean
  uppercase?: boolean
  monospaced?: boolean
  nowrap?: boolean
  isCheckbox?: boolean
  actionButtons?: ReactNode
}
export const TableCell = memo(function TableCell({
  onClick,
  align = 'center',
  asLink = false,
  capitalize = false,
  uppercase = false,
  monospaced = false,
  nowrap = false,
  isCheckbox = false,
  actionButtons,
  children,
}: TableCellProps) {
  return (
    <td className={cn([styles.Cell, isCheckbox && styles.CellCheckbox])}>
      <div className={styles.CellContent}>
        <div className={cn([
          styles.CellValue,
          (
            (align === 'left' && styles.CellAlignToLeft)
            || (align === 'right' && styles.CellAlignToRight)
            || ((!align || (align === 'center')) && styles.CellAlignToCenter)
          ),
        ])}
        >
          <div
            className={cn([
              styles.CellValueLabel,
              (asLink && styles.CellValueLabelAsLink),
              (capitalize && styles.CellCapitalize),
              (uppercase && styles.CellUppercase),
              (monospaced && styles.CellFontMonospace),
              (nowrap && styles.CellNoWrap),
            ])}
          >
            {asLink ? (
              <Button
                onClick={onClick}
                transparent
                noBorder
                noPadding
                noCapitalize={!capitalize}
              >
                {children}
              </Button>
            ) : (
              children
            )}
          </div>
        </div>

        {!!actionButtons && (
          <div className={styles.CellActionButtonsGroup}>
            {actionButtons}
          </div>
        )}
      </div>
    </td>
  )
})

export interface TableCellAsCheckboxProps<
  P extends Entity = Entity,
> {
  item: P
  selectedItemsUuids?: string[]
  onSelectItem?: (item: P, isSelected: boolean) => void
}
export const TableCellAsCheckbox = memo(function TableCellAsCheckbox<
  P extends Entity = Entity,
>({
  item,
  selectedItemsUuids,
  onSelectItem,
}: TableCellAsCheckboxProps<P>) {
  const isSelected = useMemo(function isSelectedMemo() {
    if (!selectedItemsUuids?.length) {
      return false
    }

    return Boolean(selectedItemsUuids.find(
      selectedItemUuid => selectedItemUuid === item.uuid
    ))
  }, [selectedItemsUuids, item])

  const handleSelectItem = useCallback(function handleSelectItem() {
    if (typeof onSelectItem !== 'function') {
      return
    }

    onSelectItem(item, !isSelected)
  }, [onSelectItem, item, isSelected])

  return (
    <TableCell
      align="center"
      isCheckbox={true}
    >
      <input
        type="checkbox"
        checked={isSelected}
        name="uuid"
        value={item.uuid}
        onChange={handleSelectItem}
      />
    </TableCell>
  )
})

export interface TableCellAsLabelProps<
  P extends Entity = Entity,
> {
  item: P
  column: ColumnWithLinkToEditItem<P>
  columnIndex: number
  onSelectItem?: (item: P) => void
}
export const TableCellAsLabel = memo(function TableCellAsLabel<
  P extends Entity = Entity,
>({
  item,
  column,
  columnIndex,
  onSelectItem,
}: TableCellAsLabelProps<P>) {
  const handleSelectItem = useCallback(function handleSelectItem() {
    if (typeof onSelectItem !== 'function') {
      return
    }

    onSelectItem(item)
  }, [onSelectItem, item])

  const CellFormattedValue = useMemo(function cellFormattedValueMemo() {
    const FormatValue = column.formatValue

    if (typeof FormatValue === 'function') {
      return function FormatValueWrapper() {
        return (<FormatValue value={item[column.name]} item={item} />)
      }
    }

    return function ValueWrapper() {
      return (
        <>
          {(item[column.name] === null || item[column.name] === undefined) ? (
            <NoDataCell>
              (no&nbsp;data)
            </NoDataCell>
          ) : (`${item[column.name]}`)}
        </>
      )
    }
  }, [column, item])

  const cellActionButtons = useMemo(function cellActionButtonsMemo() {
    const ActionButtons = column.actionButtons

    if (typeof ActionButtons !== 'function') {
      return undefined
    }

    return (
      <>
        <ActionButtons value={item[column.name]} item={item} />
      </>
    )
  }, [column, item])

  let align: TableCellProps['align']

  if (column.type === 'number') {
    align = 'right'
  } else if (columnIndex === 0) {
    align = 'left'
  }

  if (column.alignLabel === 'left') {
    align = 'left'
  } else if (column.alignLabel === 'right') {
    align = 'right'
  } else if (column.alignLabel === 'center') {
    align = 'center'
  }

  return (
    <TableCell
      align={align}
      capitalize={column.capitalize}
      uppercase={column.uppercase}
      monospaced={column.monospaced}
      nowrap={column.nowrap}
      onClick={handleSelectItem}
      actionButtons={cellActionButtons}
      asLink={column.asLinkToEditItem || column.asLinkToSelectItem}
    >
      <CellFormattedValue />
    </TableCell>
  )
})

export interface TableRowProps<
  T extends Entity = Entity,
> extends PropsWithChildren {
  item?: T
  onClick?: (item?: T) => void
  isHighlightRow?: boolean
  isHighlightRowBlinking?: boolean
}
export const TableRow = memo(function TableRow<
  T extends Entity = Entity,
>({
  item,
  onClick,
  isHighlightRow,
  isHighlightRowBlinking,
  children,
}: TableRowProps<T>) {
  const tableRowRef = useRef<HTMLTableRowElement>(null)

  const handleClick = useCallback(function handleClick() {
    if (typeof onClick !== 'function') {
      return
    }

    onClick(item)
  }, [onClick, item])

  useEffect(function scrollTableToTheRowIfTheTableRowIsHighlightedButNotVisibleInViewEffect() {
    if (!isHighlightRow) {
      return
    }

    const element = tableRowRef?.current

    if (!element) {
      return
    }

    const tableContainerElement = element.closest('table')?.parentElement

    if (isHtmlElementVisibleInScrollableContainer(element, tableContainerElement)) {
      return
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }, [isHighlightRow])

  return (
    <tr
      ref={tableRowRef}
      className={cn([
        styles.Row,
        isHighlightRow && styles.HighlightRow,
        (isHighlightRow && isHighlightRowBlinking) && styles.HighlightRowBlinking,
      ])}
      onClick={handleClick}
    >
      {children}
    </tr>
  )
})

export interface TableRowWithCheckboxAndLabelsProps<
  P extends Entity = Entity,
> {
  item: P
  columns: Column<P>[]
  selectedItemsUuids?: P['uuid'][]
  onEditItem?: (item: P) => void
  onSelectItem?: (item: P, checked: boolean) => void
  isHighlightRow?: boolean
}
export const TableRowWithCheckboxAndLabels = memo(function TableRowWithCheckboxAndLabels<
  P extends Entity = Entity,
>({
  item,
  columns,
  selectedItemsUuids,
  onEditItem,
  onSelectItem,
  isHighlightRow,
}: TableRowWithCheckboxAndLabelsProps<P>) {
  return (
    <TableRow
      isHighlightRow={isHighlightRow}
      isHighlightRowBlinking={true}
    >
      {columns.map((column, columnIndex) => {
        if (isCheckboxColumn(column)) {
          return (
            <TableCellAsCheckbox
              key={column.name}
              item={item}
              selectedItemsUuids={selectedItemsUuids}
              onSelectItem={onSelectItem}
            />
          )
        }

        if (isLinkToEditItemColumn(column)) {
          return (
            <TableCellAsLabel
              key={column.name}
              item={item}
              // @ts-expect-error Type 'P[string]' is not assignable to type 'undefined'
              column={column}
              columnIndex={columnIndex}
              onSelectItem={onEditItem}
            />
          )
        }

        return (
          <TableCellAsLabel
            key={column.name}
            item={item}
            column={column}
            columnIndex={columnIndex}
          />
        )
      })}
    </TableRow>
  )
})

export type ColumnWithCheckbox<T, K extends Extract<keyof T, string | number> = Extract<keyof T, string | number>> = {
  name: K
  isCheckbox: boolean
}

export type ColumnWithValue<T, K extends Extract<keyof T, string | number> = Extract<keyof T, string | number>> = {
  name: K
  label?: string
  alignLabel?: 'left' | 'right' | 'center'
  type?: 'number' | 'string'
  formatValue?: ({ value, item }: { value: T[K], item: T }) => React.ReactNode
  actionButtons?: ({ value, item }: { value: T[K], item: T }) => React.ReactNode
  capitalize?: boolean
  uppercase?: boolean
  monospaced?: boolean
  nowrap?: boolean
  isSortable?: boolean
  sort?: ColumnSortingDirection
  sortFn?: (itemAAttribute: T[K], itemBAttribute: T[K], itemA: T, itemB: T) => number
  isSearchCaseInsensitive?: boolean
}

export type ColumnWithLinkToEditItem<T> = ColumnWithValue<T> & {
  asLinkToEditItem?: boolean
  asLinkToSelectItem?: boolean
}

export type Column<T> =
  | ColumnWithValue<T>
  | ColumnWithCheckbox<T>
  | ColumnWithLinkToEditItem<T>

interface TableHeadProps<T extends Entity = Entity> {
  tableColumns: Column<T>[]
  columnsToSortBy: Column<T>[]
  areAllItemsSelected: boolean
  onSelectAllItems?: (() => void)
  onColumnHeaderClick?: ((column: Column<T>, sortDirection: ColumnSortingDirection) => void)
}
const TableHead = memo(function TableHead<T extends Entity = Entity>({
  tableColumns,
  columnsToSortBy,
  areAllItemsSelected,
  onSelectAllItems,
  onColumnHeaderClick,
}: TableHeadProps<T>) {
  return (
    <thead className={styles.TableHead}>
      <tr>
        {tableColumns.map((tableColumn) => {
          if (isCheckboxColumn(tableColumn)) {
            return (
              <TableHeaderCellAsCheckbox
                key={tableColumn.name}
                areAllItemsSelected={areAllItemsSelected}
                onSelectAllItems={onSelectAllItems}
              />
            )
          }

          return (
            <TableHeaderCell
              key={tableColumn.name}
              column={tableColumn}
              columnsToSortBy={columnsToSortBy}
              onColumnHeaderClick={onColumnHeaderClick}
            />
          )
        })}
      </tr>
    </thead>
  )
})

interface TableBodyProps<T extends Entity = Entity> {
  items: T[]
  columns: Column<T>[]
  selectedItemsUuids?: T['uuid'][]
  onEditItem?: Dispatch<SetStateAction<T | undefined>>
  onSelectItem?: (itemToSelect: T, selected: boolean) => void
  lastCreatedOrUpdatedItem?: T
}
export const TableBody = memo(function TableBody<
  T extends Entity = Entity
>({
  items,
  columns,
  selectedItemsUuids = [],
  onEditItem = () => undefined,
  onSelectItem = () => undefined,
  lastCreatedOrUpdatedItem,
}: TableBodyProps<T>) {
  const displayingItemsThrottledByTime = useThrottleDisplayingItemsByTime({ items })

  return (
    <>
      {displayingItemsThrottledByTime.map(item => (
        <TableRowWithCheckboxAndLabels
          key={item.uuid}
          item={item}
          columns={columns}
          selectedItemsUuids={selectedItemsUuids}
          onEditItem={onEditItem}
          onSelectItem={onSelectItem}
          isHighlightRow={lastCreatedOrUpdatedItem?.uuid === item.uuid}
        />
      ))}
    </>
  )
})

interface TableProps<
  T extends Entity = Entity,
  F = unknown
> extends PropsWithChildren {
  tableTitle: string
  tableColumns: Column<T>[]
  items: T[]
  noItemsLabel?: string
  isLoading?: boolean
  loadingLabel?: string
  itemTypeName?: string
  itemTypeNamePlural?: string

  searchFieldValue?: string

  filterValue?: FilterValue<F>
  isAppliedFilter?: boolean
  onEnableFilter?: () => void
  onDisableFilter?: () => void
  filterInfoFields?: FilterInfoField<F>[]

  onShowCreateItemModal?: () => void
  showCreateItemModalButtonLabel?: string

  columnsToSortBy?: Column<T>[]
  onColumnHeaderClick?: (column: Column<T>, sortDirection: ColumnSortingDirection) => void

  selectedItemsUuids?: string[]
  onResetSelectedItems?: () => void
  onSelectAllItems?: () => void
  onDeleteSelectedItems?: () => void

  addBlankItemsButton?: () => React.JSX.Element

  CopySelectedItemsButton?: () => React.JSX.Element
}
export const Table = memo(function Table<
  T extends Entity = Entity,
  F = unknown
>({
  tableTitle = 'Table',
  tableColumns = [],
  items = [],
  noItemsLabel = 'no data',
  isLoading = false,
  loadingLabel = 'loading data...',
  itemTypeName = 'item',
  itemTypeNamePlural = 'items',

  searchFieldValue,

  filterValue,
  isAppliedFilter,
  onEnableFilter,
  onDisableFilter,
  filterInfoFields,

  onShowCreateItemModal,
  showCreateItemModalButtonLabel = 'add item',

  columnsToSortBy = [],
  onColumnHeaderClick,

  selectedItemsUuids,
  onResetSelectedItems,
  onSelectAllItems,
  onDeleteSelectedItems,

  CopySelectedItemsButton,

  children,
}: TableProps<T, F>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { vertical } = useDoesElementHaveVisibleScrollbars(tableContainerRef, items)

  const tableContainerClassNames = cn([
    styles.TableContainer,
    vertical && styles.TableContainerWithVisibleScrollbar,
  ])

  const areAllItemsSelected = useMemo(function areAllItemsSelectedMemo() {
    if (!items.length) {
      return false
    }

    if (!selectedItemsUuids?.length) {
      return false
    }

    return !(items.find(item => !selectedItemsUuids.includes(item.uuid)))
  }, [items, selectedItemsUuids])

  const isThereAnySelectedItem = !!(selectedItemsUuids?.length)

  return (
    <div className={styles.TableWrapper}>

      <div className={styles.TableHeaderContainer}>
        <div className={styles.TableHeaderLeftPart}>
          <h2 className={styles.TableTitle}>
            {tableTitle}
          </h2>
          <div className={styles.TableTitleActonButtons}>
            {!isThereAnySelectedItem && (
              <>
                {onShowCreateItemModal && (
                  <Button
                    noPadding
                    transparent
                    onClick={onShowCreateItemModal}
                    title={showCreateItemModalButtonLabel}
                  >
                    <i className="icon icon-add"></i>
                  </Button>
                )}

              </>
            )}

            {isThereAnySelectedItem && (
              <>
                {(typeof onResetSelectedItems === 'function') && (
                  <Button
                    disabled={!selectedItemsUuids?.length}
                    noPadding
                    transparent
                    onClick={onResetSelectedItems}
                    title="clear selection"
                  >
                    <i className="icon icon-remove_selection"></i>
                  </Button>
                )}

                {(typeof onDeleteSelectedItems === 'function') && (
                  <Button
                    disabled={!selectedItemsUuids?.length}
                    noPadding
                    transparent
                    onClick={onDeleteSelectedItems}
                    title="delete selected"
                  >
                    <i className="icon icon-delete_forever"></i>
                  </Button>
                )}

                {(typeof CopySelectedItemsButton === 'function')
                  && CopySelectedItemsButton()}
              </>
            )}
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

          {(
            (typeof onEnableFilter === 'function')
            && (typeof onDisableFilter === 'function')
          ) && (
            !!filterValue
            && (
              isAppliedFilter
                ? (
                    <Button
                      noPadding
                      transparent
                      onClick={onDisableFilter}
                      title="disable filter"
                    >
                      <i className="icon icon-filter_alt_off"></i>
                    </Button>
                  )
                : (
                    <Button
                      noPadding
                      transparent
                      onClick={onEnableFilter}
                      title="apply filter"
                    >
                      <i className="icon icon-filter_alt"></i>
                    </Button>
                  )
            )
          )}

        </div>
      </div>

      {isAppliedFilter && !!filterValue && (
        <div className={styles.TableFilterInfoContainer}>
          <TableFilterInfo
            filterValue={filterValue}
            filterInfoFields={filterInfoFields}
          />
        </div>
      )}

      <div ref={tableContainerRef} className={tableContainerClassNames}>
        <table className={styles.Table}>
          <TableHead
            tableColumns={tableColumns}
            columnsToSortBy={columnsToSortBy}
            areAllItemsSelected={areAllItemsSelected}
            onSelectAllItems={onSelectAllItems}
            onColumnHeaderClick={onColumnHeaderClick}
          />

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
