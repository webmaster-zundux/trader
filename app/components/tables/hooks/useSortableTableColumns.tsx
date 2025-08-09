import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Entity } from '../../../models/Entity'
import type { Column, ColumnWithValue } from '../../Table'
import type { ColumnSortingDirection } from '../utils/columnSorting'
import { COLUMN_SORT_DESC, COLUMN_SORT_NONE, isColumnSortingDirection } from '../utils/columnSorting'

function areEveryColumnsToSortByInTheSameSortableGroup<
  T extends Entity = Entity,
  C extends Column<T> = Column<T>
>(
  suggestedColumnsToSortBy: C[],
  sortableGroupColumsNames: C['name'][]
): boolean {
  const incompatibleToGroupColumn = suggestedColumnsToSortBy.find(column =>
    !sortableGroupColumsNames.includes(column.name))

  if (!incompatibleToGroupColumn) {
    return true
  }

  return false
}

function getColumnSortPedicate<
  T extends Entity = Entity,
  C extends ColumnWithValue<T> = ColumnWithValue<T>
>(
  columnToSortBy: C
): (itemA: T, itemB: T) => number {
  const directionCoefficient = (columnToSortBy.sort === COLUMN_SORT_DESC) ? -1 : +1

  const customSortPredicate = columnToSortBy.sortFn

  if (typeof customSortPredicate === 'function') {
    return function customSortPredicateWrapper(itemA: T, itemB: T): number {
      return customSortPredicate(itemA[columnToSortBy.name], itemB[columnToSortBy.name], itemA, itemB) * directionCoefficient
    }
  }

  const attributeName = columnToSortBy.name

  if (columnToSortBy.type === 'number') {
    return function numberSortPredicateWrapper(itemA: T, itemB: T): number {
      return (
        ((itemA[attributeName] ?? 0) as number) - ((itemB[attributeName] ?? 0) as number)
      ) * directionCoefficient
    }
  }

  return function stringSortPredicateWrapper(itemA: T, itemB: T): number {
    return (
      (itemA[attributeName] as string || '').localeCompare(itemB[attributeName] as string || '')
    ) * directionCoefficient
  }
}

export function useSortableTableColumns<
  T extends Entity = Entity,
  C extends ColumnWithValue<T> = ColumnWithValue<T>
>(
  items: T[],
  tableColumns: C[],
  sortableColumnGroupWithColumnsNames: C['name'][]
) {
  const defaultColumnsToSortBy = useMemo(function defaultColumnsToSortByMemo() {
    const suggestedColumnsToSortBy = tableColumns
      .filter(column => column.isSortable)
      .filter(column => isColumnSortingDirection(column.sort))

    if (!suggestedColumnsToSortBy.length) {
      return []
    }

    if (areEveryColumnsToSortByInTheSameSortableGroup<T>(suggestedColumnsToSortBy, sortableColumnGroupWithColumnsNames)) {
      return suggestedColumnsToSortBy
    }

    return [
      suggestedColumnsToSortBy[0],
    ]
  }, [sortableColumnGroupWithColumnsNames, tableColumns])

  const [columnsToSortBy, setColumnToSortBy] = useState<C[]>(defaultColumnsToSortBy)

  useEffect(function updateColumnToSortByEffect() {
    setColumnToSortBy(defaultColumnsToSortBy)
  }, [defaultColumnsToSortBy, setColumnToSortBy])

  const handleColumnSortClick = useCallback(function handleColumnSortClick(
    column: C,
    sortDirection: ColumnSortingDirection
  ) {
    if (!column.isSortable) {
      return
    }

    setColumnToSortBy((existingColumnsToSortBy: C[]): C[] => {
      if (sortDirection === COLUMN_SORT_NONE) {
        return existingColumnsToSortBy.filter(existingColumn => existingColumn.name !== column.name)
      }

      const suggestedColumnsToSortBy = existingColumnsToSortBy
        .filter(existingColumn => existingColumn.name !== column.name)
        .concat({
          ...column,
          sort: sortDirection,
        })

      if (areEveryColumnsToSortByInTheSameSortableGroup<T>(suggestedColumnsToSortBy, sortableColumnGroupWithColumnsNames)) {
        return suggestedColumnsToSortBy
      }

      return [
        {
          ...column,
          sort: sortDirection,
        },
      ]
    })
  }, [setColumnToSortBy, sortableColumnGroupWithColumnsNames])

  const columnsToSortByComparators = useMemo(function columnsToSortByComparatorsMemo() {
    return columnsToSortBy
      .filter(column => column.isSortable)
      .filter(column => isColumnSortingDirection(column.sort))
      .map(column => getColumnSortPedicate<T>(column))
  }, [columnsToSortBy])

  const itemsComparator = useMemo(function itemsComparatorMemo(): ((itemA: T, itemB: T) => number) | undefined {
    return function itemsComparator(itemA: T, itemB: T): number {
      const targetComparator = columnsToSortByComparators.find((comparator) => {
        return comparator(itemA, itemB) !== 0
      })

      if (!targetComparator) {
        return 0
      }

      return targetComparator(itemA, itemB)
    }
  }, [columnsToSortByComparators])

  const sortedItems = useMemo(function sortedItemsMemo(): T[] {
    return Array<T>()
      .concat(items)
      .sort(itemsComparator)
  }, [items, itemsComparator])

  return {
    sortedItems,
    columnsToSortBy,
    handleColumnSortClick,
  }
}
