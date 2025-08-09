import { memo, useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { getPreferredColorScheme } from '../utils/ui/getPreferredColorScheme.client'
import { Button } from './Button'
import { DarkModeIcon } from './icons/DarkModeIcon'
import { LightModeIcon } from './icons/LightModeIcon'
import { RoutineIcon } from './icons/RoutineIcon'

export const DEFAULT_PREFERED_COLOR_THEME: PreferedColorTheme = 'dark'
export const HTML_BODY_CSS_CLASS_FOR_DARK_THEME = 'ColorThemeDark'
export const HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME = 'ColorThemeLight'

export type PreferedColorTheme = 'dark' | 'light' | undefined

export const PreferedColorThemeSwitch = memo(function PreferedColorThemeSwitch() {
  const [colorTheme, setColorTheme] = useState<PreferedColorTheme>(undefined)
  const [overrideColorTheme, setOverrideColorTheme] = useLocalStorage<PreferedColorTheme>('prefered-color-scheme', undefined)

  const activateDarkTheme = useCallback(function () {
    setOverrideColorTheme('dark')
  }, [setOverrideColorTheme])

  const activateLightTheme = useCallback(function () {
    setOverrideColorTheme('light')
  }, [setOverrideColorTheme])

  const activateAutoTheme = useCallback(function () {
    setOverrideColorTheme(undefined)
  }, [setOverrideColorTheme])

  useEffect(function applyCssClassForDocumentHtmlElementEffect() {
    const currentColorTheme: Exclude<PreferedColorTheme, undefined> = overrideColorTheme || colorTheme || DEFAULT_PREFERED_COLOR_THEME

    if (currentColorTheme === 'dark') {
      window.document.body.classList.add(HTML_BODY_CSS_CLASS_FOR_DARK_THEME)
    } else if (currentColorTheme === 'light') {
      window.document.body.classList.add(HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME)
    }

    return function applyCssClassForDocumentHtmlElementEffect() {
      window.document.body.classList.remove(HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME)
    }
  }, [colorTheme, overrideColorTheme])

  useEffect(function trackingChangeOfPreferedColorSchemeEffect() {
    if (!window.matchMedia) {
      return
    }

    const darkColorSchemeQuery = window?.matchMedia?.('(prefers-color-scheme: dark)')

    function onChangePreferedColorSchemeOnDark(event: MediaQueryListEvent) {
      if (event.matches) {
        setColorTheme('dark')
        return
      }
    }

    const lightColorSchemeQuery = window?.matchMedia?.('(prefers-color-scheme: light)')

    function onChangePreferedColorSchemeOnLight(event: MediaQueryListEvent) {
      if (event.matches) {
        setColorTheme('light')
        return
      }
    }

    darkColorSchemeQuery.addEventListener('change', onChangePreferedColorSchemeOnDark)
    lightColorSchemeQuery.addEventListener('change', onChangePreferedColorSchemeOnLight)

    return function trackingChangeOfPreferedColorSchemeEffectCleanup() {
      darkColorSchemeQuery.removeEventListener('change', onChangePreferedColorSchemeOnDark)
      lightColorSchemeQuery.removeEventListener('change', onChangePreferedColorSchemeOnLight)
    }
  }, [setColorTheme])

  useEffect(function setupInitialColorThemeEffect() {
    const preferedColorScheme = getPreferredColorScheme()

    setColorTheme(preferedColorScheme)
  }, [setColorTheme])

  return (
    <>
      {((!overrideColorTheme)) && (
        <Button
          title="switch to dark theme"
          onClick={activateDarkTheme}
          size="small"
          transparent
          noPadding
          noBorder
        >
          <RoutineIcon />
        </Button>
      )}

      {(overrideColorTheme === 'dark') && (
        <Button
          title="switch to light theme"
          onClick={activateLightTheme}
          size="small"
          transparent
          noPadding
          noBorder
        >
          <DarkModeIcon />
        </Button>
      )}

      {(overrideColorTheme === 'light') && (
        <Button
          title="switch to system color scheme"
          onClick={activateAutoTheme}
          size="small"
          transparent
          noPadding
          noBorder
        >
          <LightModeIcon />
        </Button>
      )}
    </>
  )
})
