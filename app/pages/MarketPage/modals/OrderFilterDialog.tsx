import type React from 'react'
import { memo } from 'react'
import type { EntityBaseFilter } from '~/models/entities-filters/EntityBaseFilter'
import { DialogFilterForm } from '../../../components/dialogs/DialogFilterForm'
import type { FormField } from '../../../components/forms/FormFieldWithLabel.const'
import type { Promisefy } from '../../../models/utils/utility-types'

interface OrderFilterDialogProps<T extends EntityBaseFilter = EntityBaseFilter> {
  humanizedPluralItemTypeName: string
  formFields: FormField<T>[]
  filterValue?: T
  onHideFilterOrderDialog: () => void
  validateFormData?: (item: T) => string | (() => React.JSX.Element) | undefined
  onFilter: (itemData: T) => void
  onSaveFilterParamsAs?: (itemData: T) => Promisefy<string | (() => React.JSX.Element) | undefined>
}
export const OrderFilterDialog = memo(function OrderFilterDialog<
  T extends EntityBaseFilter = EntityBaseFilter,
>({
  humanizedPluralItemTypeName = 'items',
  formFields,
  filterValue,
  onHideFilterOrderDialog,
  validateFormData,
  onFilter,
  onSaveFilterParamsAs,
}: OrderFilterDialogProps<T>) {
  return (
    <div style={{ alignSelf: 'flex-start' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        minWidth: '20em',
        maxWidth: '26em',
      }}
      >
        <DialogFilterForm
          humanizedPluralItemTypeName={humanizedPluralItemTypeName}
          filterValue={filterValue}
          formFields={formFields}
          onCancel={onHideFilterOrderDialog}
          validateFormData={validateFormData}
          onFilter={onFilter}
          onSaveFilterParamsAs={onSaveFilterParamsAs}
        />
      </div>
    </div>
  )
})
