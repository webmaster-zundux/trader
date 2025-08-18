import type React from 'react'
import { Links, Scripts, ScrollRestoration } from 'react-router'
import { APP_ROOT_ELEMENT_ID } from './App.const'
import { COLOR_THEME_DARK, COLOR_THEME_LIGHT, DEFAULT_PREFERED_COLOR_THEME } from './components/PreferedColorThemeSwitch.const'
import { HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME } from './components/PreferedColorThemeSwitch.const'
import './Roboto.font.css'
import './root.css'
import { cn } from './utils/ui/ClassNames'

export function HydratedRouterLayout({ children }: { children: React.ReactNode }) {
  const bodyClassName = cn([
    (DEFAULT_PREFERED_COLOR_THEME === COLOR_THEME_DARK) && HTML_BODY_CSS_CLASS_FOR_DARK_THEME,
    (DEFAULT_PREFERED_COLOR_THEME === COLOR_THEME_LIGHT) && HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME,
  ])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#eee" />
        {/* <Meta /> // disabled because since react 19+ all native <meta> and <title> bubble ups to <head> from <body> */}
        <Links />

      </head>

      <body className={bodyClassName}>

        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>

        <div id={APP_ROOT_ELEMENT_ID}>
          {children}
        </div>

        <ScrollRestoration />
        <Scripts />

      </body>

    </html>
  )
}
