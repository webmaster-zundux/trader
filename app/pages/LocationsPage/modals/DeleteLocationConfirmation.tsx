import { memo, useCallback, useMemo } from 'react'
import type { Location } from '~/models/entities/Location'
import { usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { getLocationWithFullNameByUuidSelector, useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { ModalConfirmation } from '../../../components/modals/confirmations/ModalConfirmation'
import { useLocationsStore } from '../../../stores/entity-stores/Locations.store'

interface DeleteLocationConfirmationProps {
  itemToDelete: Location
  onHideModal: () => void
  onHideParentModal: () => void
}
export const DeleteLocationConfirmation = memo(function DeleteLocationConfirmation({
  itemToDelete,
  onHideModal,
  onHideParentModal,
}: DeleteLocationConfirmationProps) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const deleteLocation = useLocationsStore(state => state.delete)

  const handleHideDeleteLocationConfirmation = useCallback(function handleHideDeleteLocationConfirmation() {
    onHideModal()
  }, [onHideModal])

  const handleHideEditLocationModal = useCallback(function handleHideEditLocationModal() {
    onHideParentModal()
  }, [onHideParentModal])

  const handleDeleteLocation = useCallback(function handleDeleteLocation() {
    if (isLoading) {
      return
    }

    deleteLocation(itemToDelete)
    handleHideDeleteLocationConfirmation()
    handleHideEditLocationModal()
  }, [itemToDelete, handleHideDeleteLocationConfirmation, handleHideEditLocationModal, deleteLocation, isLoading])

  const confirmationTitle = useMemo(function confirmationTitleMemo() {
    const locationFullName = getLocationWithFullNameByUuidSelector(itemToDelete.uuid) || '(location without full name)'

    return (
      <>
        Are you sure you want
        {' '}
        <strong>to delete</strong>
        {' '}
        the location named
        <br />
        <strong>{locationFullName}</strong>

        ?
      </>
    )
  }, [itemToDelete])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={handleHideDeleteLocationConfirmation}
      onConfirm={handleDeleteLocation}
      confirmButtonLabel="delete location"
    />
  )
})
