import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { DEFAULT_PREFERED_COLOR_THEME, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'

type State = {
  colorTheme: PreferedColorTheme
}

export const useColorTheme = create(
  combine(
    {
      colorTheme: DEFAULT_PREFERED_COLOR_THEME,
    } as State,
    set => ({
      setColorTheme: (colorTheme: PreferedColorTheme): void => {
        set((): Partial<State> => ({
          colorTheme,
        }))
      },
    })
  )
)
