import { isRouteErrorResponse } from 'react-router'
import type { Route } from './+types/root'
import HydratedRouterApp from './HydratedRouterApp'
import { HydratedRouterLayout } from './HydratedRouterLayout'
import './Roboto.font.css'
import './root.css'

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
        version
        {' '}
        {loaderData.version}
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

export const Layout = HydratedRouterLayout

export default HydratedRouterApp

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
