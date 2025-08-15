import type { Route } from './+types/root'
import { AppErrorBoundary } from './AppErrorBoundary'
import { AppHydrateFallback } from './AppHydrateFallback'
import HydratedRouterApp from './HydratedRouterApp'
import { HydratedRouterLayout } from './HydratedRouterLayout'

export async function loader() {
  return {
    // @ts-expect-error tsconfig does not get types from `/app/vite-env.d.ts`
    version: __APP_VERSION__,
  }
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

export const HydrateFallback = AppHydrateFallback
export const Layout = HydratedRouterLayout
export const ErrorBoundary = AppErrorBoundary

export default HydratedRouterApp
