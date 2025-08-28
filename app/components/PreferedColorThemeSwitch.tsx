import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useColorTheme } from '~/stores/simple-stores/ColorTheme.store'
import { getPreferredColorScheme } from '../utils/ui/getPreferredColorScheme.client'
import { Button } from './Button'
import { COLOR_THEME_DARK, COLOR_THEME_LIGHT, COLOR_THEME_SYSTEM, DEFAULT_PREFERED_COLOR_THEME, HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME, LOCALSTORAGE_PREFERED_COLOR_THEME_KEY, type PreferedColorTheme } from './PreferedColorThemeSwitch.const'
import { Icon } from './Icon'

export const PreferedColorThemeSwitch = memo(function PreferedColorThemeSwitch() {
  const [systemCurrentColorTheme, setSystemCurrentColorTheme] = useState<PreferedColorTheme>(DEFAULT_PREFERED_COLOR_THEME)
  const [preferedColorTheme, setPreferedColorTheme] = useLocalStorage<PreferedColorTheme | typeof COLOR_THEME_SYSTEM>(LOCALSTORAGE_PREFERED_COLOR_THEME_KEY, COLOR_THEME_SYSTEM)

  const setColorTheme = useColorTheme(state => state.setColorTheme)

  const currentColorTheme: PreferedColorTheme = useMemo(() => preferedColorTheme || systemCurrentColorTheme || DEFAULT_PREFERED_COLOR_THEME, [preferedColorTheme, systemCurrentColorTheme])

  useEffect(function trackingCurrentColorTheme() {
    setColorTheme(currentColorTheme)
  }, [currentColorTheme, setColorTheme])

  const activateDarkTheme = useCallback(function () {
    setPreferedColorTheme(COLOR_THEME_DARK)
  }, [setPreferedColorTheme])

  const activateLightTheme = useCallback(function () {
    setPreferedColorTheme(COLOR_THEME_LIGHT)
  }, [setPreferedColorTheme])

  const activateSystemTheme = useCallback(function () {
    setPreferedColorTheme(COLOR_THEME_SYSTEM)
  }, [setPreferedColorTheme])

  useEffect(function applyCssClassToDocumentHtmlElementEffect() {
    if (currentColorTheme === COLOR_THEME_DARK) {
      window.document.body.classList.add(HTML_BODY_CSS_CLASS_FOR_DARK_THEME)
    } else if (currentColorTheme === COLOR_THEME_LIGHT) {
      window.document.body.classList.add(HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME)
    }

    return function applyCssClassToDocumentHtmlElementEffect() {
      window.document.body.classList.remove(HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME)
    }
  }, [currentColorTheme])

  useEffect(function trackingChangeOfPreferedColorSchemeEffect() {
    if (!window.matchMedia) {
      return
    }

    const darkColorSchemeQuery = window?.matchMedia?.('(prefers-color-scheme: dark)')

    function onChangePreferedColorSchemeOnDark(event: MediaQueryListEvent) {
      if (event.matches) {
        setSystemCurrentColorTheme(COLOR_THEME_DARK)
        return
      }
    }

    const lightColorSchemeQuery = window?.matchMedia?.('(prefers-color-scheme: light)')

    function onChangePreferedColorSchemeOnLight(event: MediaQueryListEvent) {
      if (event.matches) {
        setSystemCurrentColorTheme(COLOR_THEME_LIGHT)
        return
      }
    }

    darkColorSchemeQuery.addEventListener('change', onChangePreferedColorSchemeOnDark)
    lightColorSchemeQuery.addEventListener('change', onChangePreferedColorSchemeOnLight)

    return function trackingChangeOfPreferedColorSchemeEffectCleanup() {
      darkColorSchemeQuery.removeEventListener('change', onChangePreferedColorSchemeOnDark)
      lightColorSchemeQuery.removeEventListener('change', onChangePreferedColorSchemeOnLight)
    }
  }, [setSystemCurrentColorTheme])

  useEffect(function setupInitialColorThemeEffect() {
    const preferedColorScheme = getPreferredColorScheme()

    setSystemCurrentColorTheme(preferedColorScheme)
  }, [setSystemCurrentColorTheme])

  return (
    <>
      {!preferedColorTheme && (
        <Button
          title="switch to dark theme"
          onClick={activateDarkTheme}
          transparent
          noPadding
          noBorder
        >
          <Icon name="routine" />
        </Button>
      )}

      {(preferedColorTheme === COLOR_THEME_DARK) && (
        <Button
          title="switch to light theme"
          onClick={activateLightTheme}
          transparent
          noPadding
          noBorder
        >
          <Icon name="dark_mode" />
        </Button>
      )}

      {(preferedColorTheme === COLOR_THEME_LIGHT) && (
        <Button
          title="switch to system color scheme"
          onClick={activateSystemTheme}
          transparent
          noPadding
          noBorder
        >
          <Icon name="light_mode" />
        </Button>
      )}
    </>
  )
})
