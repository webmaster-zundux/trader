import { getAttributesNamesWithoutUuid } from '../../stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_MODAL_DIALOG = 'modal-dialog' as const

export type ModalDialog = Entity & {
  entityType: typeof ENTITY_TYPE_MODAL_DIALOG
}
export type ModalDialogAttributes = keyof ModalDialog

export const getModalDialogByUuid = (
  modalDialogUuid: string,
  modalDialogs: ModalDialog[]
) => modalDialogs.find(modalDialog => modalDialog.uuid === modalDialogUuid)

export const MODAL_DIALOG_ATTRIBUTES: ModalDialogAttributes[] = (['uuid', 'entityType'] as const) satisfies ModalDialogAttributes[]

export const MODAL_DIALOG_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(MODAL_DIALOG_ATTRIBUTES)

export function isModalDialog(value: unknown): value is ModalDialog {
  return ((value as ModalDialog)?.entityType === ENTITY_TYPE_MODAL_DIALOG)
}
