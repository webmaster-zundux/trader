import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type State = {
  isVisible?: boolean
}

export const useLoadDemoDataIntoEmptyDataStorageSuggestionVisibility = create(
  combine(
    {
      isVisible: false,
    } as State,
    set => ({
      setIsVisible: (isVisible: boolean): void => {
        set((): Partial<State> => ({
          isVisible,
        }))
      },
    })
  )
)

export function showLoadDemoDataIntoEmptyDataStorageSuggestion() {
  useLoadDemoDataIntoEmptyDataStorageSuggestionVisibility.setState({ isVisible: true })
}

export function hideLoadDemoDataIntoEmptyDataStorageSuggestion() {
  useLoadDemoDataIntoEmptyDataStorageSuggestionVisibility.setState({ isVisible: false })
}
