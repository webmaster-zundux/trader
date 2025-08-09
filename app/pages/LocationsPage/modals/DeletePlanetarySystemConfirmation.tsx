import { memo, useCallback, useMemo } from 'react'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import type { PlanetarySystem } from '../../../models/entities/PlanetarySystem'
import { usePlanetarySystemsStore } from '../../../stores/entity-stores/PlanetarySystems.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'

interface DeletePlanetarySystemConfirmationProps {
  itemToDelete: PlanetarySystem
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeletePlanetarySystemConfirmation = memo(function DeletePlanetarySystemConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeletePlanetarySystemConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePlanetarySystemsStore])

  const isLoading = isLoadingPersistStorages

  const deletePlanetarySystem = usePlanetarySystemsStore(state => state.delete)

  const handleHideDeletePlanetarySystemConfirmation = useCallback(function handleHideDeletePlanetarySystemConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditPlanetarySystemModal = useCallback(function handleHideEditPlanetarySystemModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeletePlanetarySystem = useCallback(function handleDeletePlanetarySystem() {
    if (isLoading) {
      return
    }

    deletePlanetarySystem(itemToDelete)

    handleHideDeletePlanetarySystemConfirmation()
    handleHideEditPlanetarySystemModal()
  }, [deletePlanetarySystem, itemToDelete, handleHideDeletePlanetarySystemConfirmation, handleHideEditPlanetarySystemModal, isLoading])

  const confirmationTitle = useMemo(() => {
    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        <br />
        the planetary system named
        {' '}
        <strong>{itemToDelete.name}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeletePlanetarySystemConfirmation}
      onConfirm={handleDeletePlanetarySystem}
      confirmButtonLabel="delete planetary system"
    />
  )
})
