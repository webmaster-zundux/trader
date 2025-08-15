import { isRouteErrorResponse } from 'react-router'
import type { Route } from './+types/root'
import styles from './AppErrorBoundary.module.css'

export function AppErrorBoundary({
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
    <main
      className={styles.AppErrorBoundary}
      style={{
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
