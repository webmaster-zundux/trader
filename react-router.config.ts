import type { Config } from '@react-router/dev/config'
import { loadEnv } from 'vite'

// todo add support of vite mode for loading of env variables
const env = loadEnv('', process.cwd(), '')

export const appDirectory = 'app'

// read `basename` from env variable because `import.meta.env.BASE_URL` is available only in code that processed by vite
export const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

if (basename !== '/') {
  console.log(`react-router.config: using basename`, basename)
}

export default {
  appDirectory,
  basename,
  routeDiscovery: { mode: basename !== '/' ? 'initial' : 'lazy' }, // it's turnes off when ssr: false https://github.com/remix-run/react-router/pull/13451/files
  // ssr: false, // todo try to disable ssr with `prerender: true` after the package react-router version will became > 7.8.0 https://github.com/remix-run/react-router/pull/13791
  prerender: true,
} satisfies Config
