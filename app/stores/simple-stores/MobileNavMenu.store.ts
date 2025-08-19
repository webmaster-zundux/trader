import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type State = {
  isVisible: boolean
}

export const useMobileNavMenuVisibility = create(
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

export function showMobileNavMenu() {
  useMobileNavMenuVisibility.setState({ isVisible: true })
}

export function hideMobileNavMenu() {
  useMobileNavMenuVisibility.setState({ isVisible: false })
}
