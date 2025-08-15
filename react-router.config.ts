import type { Config } from '@react-router/dev/config'
import { loadEnv } from 'vite'

// todo add support of vite mode for loading of env variables
const env = loadEnv('', process.cwd(), '')

// read `basename` from env variable because `import.meta.env.BASE_URL` is available only in code that processed by vite
const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

if (basename !== '/') {
  console.log(`react-router.config: using basename`, basename)
}

export default {
  basename,
  routeDiscovery: { mode: basename !== '/' ? 'initial' : 'lazy' }, // it's turnes off when ssr: false https://github.com/remix-run/react-router/pull/13451/files
  // ssr: false, // todo try to disable ssr with `prerender: true` after the package react-router version will became > 7.8.0 https://github.com/remix-run/react-router/pull/13791
  prerender: true,
  // prerender: [
  //   `${PAGE_SLUG_MARKET}`,
  //   `${PAGE_SLUG_HISTORY}`,
  //   `${PAGE_SLUG_LOCATIONS}`,
  //   `${PAGE_SLUG_INVENTORY}`,
  //   `${PAGE_SLUG_MOVING_ENTITIES}`,
  //   `${PAGE_SLUG_MAP}`,
  //   `${PAGE_SLUG_PRODUCTS}`,
  // ],
} satisfies Config
