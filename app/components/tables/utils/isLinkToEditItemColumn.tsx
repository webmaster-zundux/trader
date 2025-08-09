import type { ColumnWithLinkToEditItem } from '../../Table'

export function isLinkToEditItemColumn<T>(val: unknown): val is ColumnWithLinkToEditItem<T> {
  return typeof (val as ColumnWithLinkToEditItem<T>).asLinkToEditItem === 'boolean'
}
