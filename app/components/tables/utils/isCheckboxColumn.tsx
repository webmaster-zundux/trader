import type { ColumnWithCheckbox } from '../../Table'

export function isCheckboxColumn<T>(val: unknown): val is ColumnWithCheckbox<T> {
  return typeof (val as ColumnWithCheckbox<T>).isCheckbox === 'boolean'
}
