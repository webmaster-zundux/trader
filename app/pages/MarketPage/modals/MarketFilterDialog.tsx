import type React from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import type { MarketFilter } from '~/models/entities-filters/MarketFilter'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { Button } from '../../../components/Button'
import { Dialog } from '../../../components/dialogs/Dialog'
import { FormFieldContainer } from '../../../components/forms/FormFieldContainer'
import { FormFieldWithLabel } from '../../../components/forms/FormFieldWithLabel'
import { useResetFormFieldsToDefaultValues } from '../../../components/forms/hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from '../../../components/forms/hooks/useSubmitForm'
import { getMarketFilterFields } from '../getMarketFilterFields'
import styles from './MarketFilterDialog.module.css'

const validateFilterFormData = (
  filterData: MarketFilter
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

interface MarketFilterDialogProps {
  filterValue?: MarketFilter
  onSetFilterValue: (value?: MarketFilter) => void
  onHide: () => void
}
export const MarketFilterDialog = memo(function MarketFilterDialog({
  filterValue,
  onSetFilterValue,
  onHide,
}: MarketFilterDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const isLoadingCacheOfLocationsAsSelectOptions = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore])
  const locationsAsSelectOptions = useLocationsAsSelectOptionArrayStore(state => state.items)

  const filterFields = useMemo(function filterFieldsMemo() {
    if (isLoadingCacheOfLocationsAsSelectOptions) {
      return getMarketFilterFields([])
    }

    return getMarketFilterFields(locationsAsSelectOptions)
  }, [locationsAsSelectOptions, isLoadingCacheOfLocationsAsSelectOptions])

  const handleHideFilterOrderDialog = useCallback(function handleHideFilterOrderDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfBuyOrdersFilter = useCallback(function handleSetValueOfBuyOrdersFilter(
    filterAttributes: MarketFilter
  ) {
    onSetFilterValue(filterAttributes)
    handleHideFilterOrderDialog()
  }, [handleHideFilterOrderDialog, onSetFilterValue])

  const {
    handleSubmit,
    formValidationErrorMessage,
  } = useSubmitForm({
    formRef,
    onSubmit: handleSetValueOfBuyOrdersFilter,
    formFields: filterFields,
    validateFormData: validateFilterFormData,
    showErrorWhenAllVisibleFieldsEmpty: false,
  })

  const handleReset = useCallback(function handleReset() {
    handleSubmit()
  }, [handleSubmit])

  useResetFormFieldsToDefaultValues(formRef, filterFields, handleReset)

  const locationField = filterFields.find(v => v.name === 'locationUuid')!
  const locationFieldValue = filterValue?.[locationField.name]

  const minPriceField = filterFields.find(v => v.name === 'minPrice')!
  const minPriceFieldValue = filterValue?.[minPriceField.name]

  const maxPriceField = filterFields.find(v => v.name === 'maxPrice')!
  const maxPriceFieldValue = filterValue?.[maxPriceField.name]

  const minQuantityField = filterFields.find(v => v.name === 'minQuantity')!
  const minQuantityFieldValue = filterValue?.[minQuantityField.name]

  const maxQuantityField = filterFields.find(v => v.name === 'maxQuantity')!
  const maxQuantityFieldValue = filterValue?.[maxQuantityField.name]

  const dialogTitle = `filter orders`
  const filterButtonLabel = 'apply filter'
  const resetButtonLabel = 'reset filter'

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      >
        <Dialog
          title={dialogTitle}
          onHide={handleHideFilterOrderDialog}
        >
          <form
            ref={formRef}
            className={styles.DialogEditFormBody}
            onSubmit={handleSubmit}
          >
            <div className={styles.Content}>
              <div className={styles.FieldsContainer}>

                <FormFieldWithLabel
                  field={locationField}
                  fieldValue={locationFieldValue}
                />

                <FormFieldContainer
                  name={minPriceField.name}
                  label="price"
                >
                  <div className={styles.Row}>
                    <FormFieldWithLabel
                      field={minPriceField}
                      fieldValue={minPriceFieldValue}
                      hideFieldLabel
                    />
                    {' - '}
                    <FormFieldWithLabel
                      field={maxPriceField}
                      fieldValue={maxPriceFieldValue}
                      hideFieldLabel
                    />
                  </div>
                </FormFieldContainer>

                <FormFieldContainer
                  name={minQuantityField.name}
                  label="quantity"
                >
                  <div className={styles.Row}>
                    <FormFieldWithLabel
                      field={minQuantityField}
                      fieldValue={minQuantityFieldValue}
                      hideFieldLabel
                    />
                    {' - '}
                    <FormFieldWithLabel
                      field={maxQuantityField}
                      fieldValue={maxQuantityFieldValue}
                      hideFieldLabel
                    />
                  </div>
                </FormFieldContainer>

              </div>

              {(formValidationErrorMessage !== undefined) && (
                <div className={styles.ErrorMessageContainer}>
                  <span className={styles.ErrorMessageText}>
                    {
                      (typeof formValidationErrorMessage === 'function')
                        ? formValidationErrorMessage()
                        : formValidationErrorMessage
                    }
                  </span>
                </div>
              )}

            </div>

            <div className={styles.ActionButtons}>
              <div className={styles.ActionButtonsGroup}>
                <Button type="reset">
                  {resetButtonLabel}
                </Button>
              </div>
              <div className={styles.ActionButtonsGroup}>
                <Button type="submit" primary>
                  {filterButtonLabel}
                </Button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    </>
  )
})
