import type React from 'react'
import { memo, useCallback } from 'react'
import type { FilterField } from '../../../components/tables/hooks/useTableFilter'
import type { BuyOrderFilter } from '../../../models/entities-filters/BuyOrderFilter'
import type { BuyOrder } from '../../../models/entities/BuyOrder'
import { OrderFilterDialog } from './OrderFilterDialog'

const validateFilterFormData = (
  filterData: BuyOrderFilter
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

export type BuyOrderFilterField = FilterField<BuyOrder, BuyOrderFilter>

interface BuyOrdersFilterDialogProps {
  filterFields: BuyOrderFilterField[]
  filterValue?: BuyOrderFilter
  onSetFilterValue: (value: BuyOrderFilter) => void
  onHide: () => void
}
export const BuyOrderFilterDialog = memo(function BuyOrderFilterDialog({
  filterFields,
  filterValue,
  onSetFilterValue,
  onHide,
}: BuyOrdersFilterDialogProps) {
  const handleHideFilterOrderDialog = useCallback(function handleHideFilterOrderDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfBuyOrdersFilter = useCallback(function handleSetValueOfBuyOrdersFilter(filterAttributes: BuyOrderFilter) {
    onSetFilterValue(filterAttributes)
    handleHideFilterOrderDialog()
  }, [handleHideFilterOrderDialog, onSetFilterValue])

  return (
    <OrderFilterDialog
      humanizedPluralItemTypeName="buy order"
      formFields={filterFields}
      filterValue={filterValue}
      onHideFilterOrderDialog={handleHideFilterOrderDialog}
      validateFormData={validateFilterFormData}
      onFilter={handleSetValueOfBuyOrdersFilter}
    />
  )
})
