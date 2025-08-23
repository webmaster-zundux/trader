import type React from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import { FormFieldList } from '~/components/forms/FormFieldList'
import type { MapOrderPricesFilter } from '~/models/entities-filters/MapOrderPricesFilter'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { useProductsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductsAsSelectOptionArray.store'
import { Button } from '../../../components/Button'
import { Dialog } from '../../../components/dialogs/Dialog'
import { useResetFormFieldsToDefaultValues } from '../../../components/forms/hooks/useResetFormFieldsToDefaultValues'
import { useSubmitForm } from '../../../components/forms/hooks/useSubmitForm'
import styles from './MapOrderPricesFilterDialog.module.css'
import { getMapOrderPricesFilterFields } from './getMapOrderPricesFilterFields'
import { useProductsStore } from '~/stores/entity-stores/Products.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'

const validateFilterFormData = (
  filterData: MapOrderPricesFilter
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

interface MapOrderPricesFilterDialogProps {
  filterValue?: MapOrderPricesFilter
  onSetFilterValue: (value?: MapOrderPricesFilter) => void
  onHide: () => void
}
export const MapOrderPricesFilterDialog = memo(function MapOrderPricesFilterDialog({
  filterValue,
  onSetFilterValue,
  onHide,
}: MapOrderPricesFilterDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore, useProductsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore, useProductsAsSelectOptionArrayStore])
  const locationsAsSelectOptions = useLocationsAsSelectOptionArrayStore(state => state.items)
  const productsAsSelectOptions = useProductsAsSelectOptionArrayStore(state => state.items)
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const filterFields = useMemo(function filterFieldsMemo() {
    if (isLoading) {
      return getMapOrderPricesFilterFields({
        locationsAsSelectOptions: [],
        productsAsSelectOptions: [],
      })
    }

    return getMapOrderPricesFilterFields({
      locationsAsSelectOptions,
      productsAsSelectOptions
    })
  }, [isLoading, locationsAsSelectOptions, productsAsSelectOptions])

  const handleHideFilterOrderDialog = useCallback(function handleHideFilterOrderDialog() {
    onHide()
  }, [onHide])

  const handleSetValueOfBuyOrdersFilter = useCallback(function handleSetValueOfBuyOrdersFilter(
    filterAttributes: MapOrderPricesFilter
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

  // const locationField = filterFields.find(v => v.name === 'locationUuid')!
  // const locationFieldValue = filterValue?.[locationField.name]

  // const minPriceField = filterFields.find(v => v.name === 'minPrice')!
  // const minPriceFieldValue = filterValue?.[minPriceField.name]

  // const maxPriceField = filterFields.find(v => v.name === 'maxPrice')!
  // const maxPriceFieldValue = filterValue?.[maxPriceField.name]

  // const minQuantityField = filterFields.find(v => v.name === 'minQuantity')!
  // const minQuantityFieldValue = filterValue?.[minQuantityField.name]

  // const maxQuantityField = filterFields.find(v => v.name === 'maxQuantity')!
  // const maxQuantityFieldValue = filterValue?.[maxQuantityField.name]

  // const minProfitField = filterFields.find(v => v.name === 'minProfit')!
  // const minProfitFieldValue = filterValue?.[minProfitField.name]

  const dialogTitle = `filter orders`
  const filterButtonLabel = 'apply filter'
  const resetButtonLabel = 'reset filter'

  return (
    <>
      {/* <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      > */}
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
            <FormFieldList
              formFields={filterFields}
              item={filterValue}
            />
            {/* <div className={styles.FieldsContainer}>

              <FormFieldWithLabel
                field={locationField}
                fieldValue={locationFieldValue}
              />

              <FormFieldWrapper
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

              <FormFieldWrapper
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

              <FormFieldWithLabel
                field={minProfitField}
                fieldValue={minProfitFieldValue}
              />

            </div> */}

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
      {/* </div> */}
    </>
  )
})
