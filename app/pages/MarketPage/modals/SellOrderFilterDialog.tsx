import type React from 'react'
import { memo, useCallback } from 'react'
import type { FilterField } from '../../../components/tables/hooks/useTableFilter'
import type { SellOrderFilter } from '../../../models/entities-filters/SellOrderFilter'
import type { SellOrder } from '../../../models/entities/SellOrder'
import { OrderFilterDialog } from './OrderFilterDialog'

const validateFilterFormData = (
  filterData: SellOrderFilter
): string | (() => React.JSX.Element) | undefined => {
  if (!filterData) {
    return undefined
  }

  const {
    minPrice,
    maxPrice,
    minQuantity,
    maxQuantity,
  } = filterData

  if (
    (
      typeof minPrice === 'number'
      && Number.isFinite(minPrice)
    ) && (
      typeof maxPrice === 'number'
      && Number.isFinite(maxPrice)
    )
  ) {
    if (minPrice > maxPrice) {
      return function ErrorMessage() {
        return (
          <>
            <strong>Max price</strong>
            {' '}
            should be equal or greater then
            {' '}
            <strong>min price</strong>
            .
          </>
        )
      }
    }
  }

  if (
    (
      typeof minQuantity === 'number'
      && Number.isFinite(minQuantity)
    ) && (
      typeof maxQuantity === 'number'
      && Number.isFinite(maxQuantity)
    )
  ) {
    if (minQuantity > maxQuantity) {
      return function ErrorMessage() {
        return (
          <>
            <strong>Max quantity</strong>
            {' '}
            should be equal or greater then
            {' '}
            <strong>min quantity</strong>
            .
          </>
        )
      }
    }
  }

  return undefined
}

export type SellOrderFilterField = FilterField<SellOrder, SellOrderFilter>

interface SellOrderFilterDialogProps {
  filterFields: SellOrderFilterField[]
  filterValue?: SellOrderFilter
  onSetFilterValue: (value: SellOrderFilter | undefined) => void
  onHide: () => void
}
export const SellOrderFilterDialog = memo(function SellOrderFilterDialog({
  filterFields,
  filterValue,
  onSetFilterValue,
  onHide,
}: SellOrderFilterDialogProps) {
  const handleHideFilterOrderDialog = useCallback(function handleHideFilterOrderDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfSellOrderFilter = useCallback(function handleSetValueOfSellOrderFilter(filterAttributes: SellOrderFilter) {
    const filterValueAttributesNames = Object.keys(filterAttributes)

    if (!filterValueAttributesNames.length) {
      onSetFilterValue(undefined)
    } else {
      onSetFilterValue(filterAttributes)
    }

    handleHideFilterOrderDialog()
  }, [handleHideFilterOrderDialog, onSetFilterValue])

  return (
    <OrderFilterDialog
      humanizedPluralItemTypeName="sell order"
      formFields={filterFields}
      filterValue={filterValue}
      onHideFilterOrderDialog={handleHideFilterOrderDialog}
      validateFormData={validateFilterFormData}
      onFilter={handleSetValueOfSellOrderFilter}
    />
  )
})
