import type { Route } from './+types/root'

export function AppHydrateFallback({
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
        Loading...
      </div>
      <div>
        version
        {' '}
        {loaderData.version}
      </div>
    </main>
  )
}
