import { useEffect } from 'react'
import { useIsVisible } from '~/hooks/ui/useIsVisible'
import type { EntityBaseFilter } from '~/models/entities-filters/EntityBaseFilter'

export function useTableFilterApplyingToggler(filterValue: EntityBaseFilter | undefined) {
  const {
    isVisible: isAppliedFilter,
    show: handleEnableFilter,
    hide: handleDisableFilter,
  } = useIsVisible(true)

  useEffect(function applyFilterWhenFilterValueChangesEffect() {
    handleEnableFilter()
  }, [filterValue, handleEnableFilter])

  return {
    isAppliedFilter,
    enableFilter: handleEnableFilter,
    disableFilter: handleDisableFilter,
  }
}
