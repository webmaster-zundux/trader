import { COLOR_THEME_DARK, COLOR_THEME_LIGHT, DEFAULT_PREFERED_COLOR_THEME, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'

export function getPreferredColorScheme(): PreferedColorTheme {
  if (!window?.matchMedia) {
    return DEFAULT_PREFERED_COLOR_THEME
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return COLOR_THEME_DARK
  } else if (window.matchMedia?.('(prefers-color-scheme: light)')?.matches) {
    return COLOR_THEME_LIGHT
  }

  return DEFAULT_PREFERED_COLOR_THEME
}
