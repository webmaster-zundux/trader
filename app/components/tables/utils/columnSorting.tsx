export const COLUMN_SORT_NONE = 'none' as const
export const COLUMN_SORT_ASC = 'asc' as const
export const COLUMN_SORT_DESC = 'desc' as const

export const columnSortDirectionLoop = {
  [COLUMN_SORT_NONE]: COLUMN_SORT_ASC,
  [COLUMN_SORT_ASC]: COLUMN_SORT_DESC,
  [COLUMN_SORT_DESC]: COLUMN_SORT_NONE,
}

export function isColumnSortingDirection(sortDirection: unknown): sortDirection is ColumnSortingDirection {
  return (
    ((sortDirection as ColumnSortingDirection) === COLUMN_SORT_ASC)
    || ((sortDirection as ColumnSortingDirection) === COLUMN_SORT_DESC)
  )
}

export function getNextColumnSortDirection(sortDirection?: ColumnSortingDirection) {
  if (!sortDirection) {
    return COLUMN_SORT_ASC
  }

  return columnSortDirectionLoop[sortDirection]
}

export type ColumnSortingDirection
  = | typeof COLUMN_SORT_NONE
    | typeof COLUMN_SORT_ASC
    | typeof COLUMN_SORT_DESC
