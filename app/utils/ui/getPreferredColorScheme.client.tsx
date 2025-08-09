import { type PreferedColorTheme } from '../../components/PreferedColorThemeSwitch'

export function getPreferredColorScheme(): PreferedColorTheme {
  if (!window?.matchMedia) {
    return undefined
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'dark'
  } else if (window.matchMedia?.('(prefers-color-scheme: light)')?.matches) {
    return 'light'
  }

  return undefined
}
