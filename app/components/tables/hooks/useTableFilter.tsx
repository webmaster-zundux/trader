import { useCallback, useMemo } from 'react'
import type { FormField } from '~/components/forms/FormFieldWithLabel.const'
import type { Entity } from '../../../models/Entity'

export type FilterValue = object

export type FieldFilterPredicate<
  T,
  F extends FilterValue = FilterValue
> = (item: T, filterValue: F) => boolean

export type FieldFilterPredicates<
  T,
  F extends FilterValue = FilterValue
> = {
  [key: string]: FieldFilterPredicate<T, F>
}

export type FilterField<
  T,
  F extends FilterValue = FilterValue
> = FormField<F> & {
  filterPredicate?: FieldFilterPredicate<T, F>
  name: Extract<keyof F, string>
}

export function getFilterPredicatesFromFilterFormFields<
  T extends Entity = Entity,
  F extends FilterValue = FilterValue
>(
  filterFields: FilterField<T, F>[]
): {
  [key: string]: FieldFilterPredicate<T, F>
} {
  const fieldPredicates: {
    [key: string]: FieldFilterPredicate<T, F>
  } = {}

  filterFields.forEach(({ name, filterPredicate }) => {
    if (typeof filterPredicate === 'function') {
      fieldPredicates[name] = filterPredicate
    }
  })

  return fieldPredicates
}

export function isItemPassedFilterPredicate<
  T extends Entity = Entity,
  F extends FilterValue = FilterValue
>(
  item: T,
  itemFilterFieldsPredicates: FieldFilterPredicates<T, F>,
  itemsFilterValue: F
): boolean {
  let result = true

  for (const parameterName in itemsFilterValue) {
    if (
      Boolean(itemsFilterValue[parameterName])
      && (typeof itemFilterFieldsPredicates[parameterName] === 'function')
    ) {
      result = itemFilterFieldsPredicates[parameterName](item, itemsFilterValue)

      if (!result) {
        return false
      }
    }
  }

  return result
}

export function useTableFilter<
  T extends Entity = Entity,
  F extends FilterValue = FilterValue
>(
  items: T[] = [],
  filterFormFields: FilterField<T, F>[] = [],
  filterValue?: F
) {
  const filterFieldsPredicates = useMemo(function filterFieldsPredicatesMemo() {
    return getFilterPredicatesFromFilterFormFields(filterFormFields)
  }, [filterFormFields])

  const itemFilterPredicate = useCallback(function itemFilterPredicate(item: T): boolean {
    if (!filterValue || !filterFieldsPredicates) {
      return true
    }

    return isItemPassedFilterPredicate(
      item,
      filterFieldsPredicates,
      filterValue
    )
  }, [filterValue, filterFieldsPredicates])

  const filteredItems = useMemo(function filteredItemsMemo() {
    return items.filter(itemFilterPredicate)
  }, [items, itemFilterPredicate])

  return filteredItems
}
