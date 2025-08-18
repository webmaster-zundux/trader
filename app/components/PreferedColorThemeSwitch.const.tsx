export const COLOR_THEME_LIGHT = 'light'
export const COLOR_THEME_DARK = 'dark'
export const COLOR_THEME_SYSTEM = undefined

export type PreferedColorTheme = typeof COLOR_THEME_LIGHT | typeof COLOR_THEME_DARK

export const DEFAULT_PREFERED_COLOR_THEME: PreferedColorTheme = COLOR_THEME_LIGHT

export const HTML_BODY_CSS_CLASS_FOR_DARK_THEME = 'ColorThemeDark'
export const HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME = 'ColorThemeLight'

export const LOCALSTORAGE_PREFERED_COLOR_THEME_KEY = 'prefered-color-theme'
