import type React from 'react'
import { Links, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import type { Route } from './+types/root'
import { AppPageContentLayout } from './components/PageLayout'
import { DEFAULT_PREFERED_COLOR_THEME, HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME } from './components/PreferedColorThemeSwitch'
import { APP_ROOT_ELEMENT_ID } from './main.const'
import './Roboto.font.css'
import './root.css'
import { USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA, storagesRequiredForDemo } from './stores/checkIfDemoDataCouldBeLoaded'
import { useLoadingPersistStorages } from './stores/hooks/useLoadingPersistStorages'
import { cn } from './utils/ui/ClassNames'

export async function loader() {
  return {
    // @ts-expect-error tsconfig does not get types from `/app/vite-env.d.ts`
    version: __APP_VERSION__,
  }
}

export function HydrateFallback({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      gap: '1em',
    }}
    >
      <div>
        Loading app...
      </div>
      <div>
        Loading version
        {' '}
        {loaderData.version}
        ...
      </div>
    </main>
  )
}

export const links: Route.LinksFunction = () => [
  {
    rel: 'manifest',
    href: `${import.meta.env.BASE_URL}manifest.json`
  },
  {
    rel: 'icon',
    type: 'image/svg+xml',
    href: `${import.meta.env.BASE_URL}favicon.svg`
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  const bodyClassName = cn([
    DEFAULT_PREFERED_COLOR_THEME === 'dark' && HTML_BODY_CSS_CLASS_FOR_DARK_THEME,
    DEFAULT_PREFERED_COLOR_THEME === 'light' && HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME,
  ])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#eee" />
        {/* <Meta /> // disabled because creates hydration errors with react 19+ */}
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

function DefaultAppRoot() {
  return (
    <AppPageContentLayout />
  )
}

function AppRootWithPersistentDataCheck() {
  useLoadingPersistStorages(storagesRequiredForDemo)

  return (
    <AppPageContentLayout />
  )
}

let App = DefaultAppRoot

if (USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA) {
  App = AppRootWithPersistentDataCheck
}

export default App

export function ErrorBoundary({
  error
}: Route.ErrorBoundaryProps) {
  let message = 'Error'
  let details = 'An unexpected error occured'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = (error.status === 404) ? '404' : 'Unknown status error'

    details = (error.status === 404)
      ? 'the requested page could not be found'
      : error.statusText || 'An unexpected error occured'
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      gap: '1em',
    }}
    >
      <h1 style={{ margin: '0' }}>
        {message}
      </h1>

      <p style={{ margin: '0' }}>
        {details}
      </p>

      {!!stack && (
        <pre className="">
          <code>
            {stack}
          </code>
        </pre>
      )}
    </main>
  )
}
