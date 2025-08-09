import { memo, useMemo } from 'react'
import styles from './TableSelectedFilterInfo.module.css'

export type FilterValue<T> = { [K in keyof T ]: T[K] }

export type FormatLabelAndValueProps<T> = {
  name: keyof T
  label?: string
  value?: T[keyof T]
  filterValue?: FilterValue<T>
}

export type FormatLabelAndValue<T> = (
  args: FormatLabelAndValueProps<T>
) => ({
  label: string
  value: string
}) | undefined

export type FilterInfoField<T = unknown> = {
  name: keyof T
  groupNames?: (keyof T)[]
  label?: string
  formatLabelAndValue?: FormatLabelAndValue<T>
}

interface TableFilterInfoProps<T> {
  filterValue: FilterValue<T> | undefined
  filterInfoFields?: FilterInfoField<T>[]
}
export const TableFilterInfo = memo(function TableFilterInfo<T, K = keyof T>({
  filterValue,
  filterInfoFields = [],
}: TableFilterInfoProps<T>) {
  const displayingFilterParamsInfoFieldsNames = useMemo(function displayingFilterParamsInfoFieldsNamesMemo() {
    if (!filterValue) {
      return []
    }

    if (!filterInfoFields?.length) {
      return []
    }

    const filterValueAttributesNames = Object.keys(filterValue) as K[]
    const filterInfoFieldsNames = filterInfoFields
      .map(({ name, groupNames }) => {
        let filterInfoFieldsNames = [name]

        if (groupNames) {
          filterInfoFieldsNames = filterInfoFieldsNames.concat(...groupNames)
        }

        return filterInfoFieldsNames
      })
      .flat()
      .filter(v => v) as K[]

    const displayingNames: K[] = []

    filterInfoFieldsNames.forEach((parameterName) => {
      if (filterValueAttributesNames.includes(parameterName)) {
        displayingNames.push(parameterName)
      }
    })

    return displayingNames
  }, [filterValue, filterInfoFields])

  if (!filterValue) {
    return null
  }

  if (!filterInfoFields?.length) {
    return null
  }

  if (!displayingFilterParamsInfoFieldsNames.length) {
    return null
  }

  return (
    <div className={styles.FilterParametersInfoContainer}>
      <div>Filtered by </div>
      <ul className={styles.FilterParametersList}>
        {
          filterInfoFields.map(({
            name: fieldName,
            label: fieldLabel,
            formatLabelAndValue,
          }) => {
            let label = fieldLabel || fieldName.toString()
            let value = `${filterValue[fieldName]}`

            if (typeof formatLabelAndValue === 'function') {
              const formated = formatLabelAndValue({
                name: fieldName,
                label: fieldLabel,
                value: filterValue[fieldName],
                filterValue: filterValue,
              })

              if (!formated) {
                return undefined
              }

              label = formated.label
              value = formated.value
            }

            if (value === undefined) {
              return
            }

            return (
              <li
                key={fieldName.toLocaleString()}
                className={styles.FilterParametersListItem}
              >
                <span className={styles.FilterParameterName}>
                  {label}
                  :
                </span>
                <span className={styles.FilterParameterValue}>
                  {value}
                </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
})
