import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes'
import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from './router/PageSlugs.const'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')

// read `basename` from env variable because `import.meta.env.BASE_URL` is available only code that processed by vite
const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'
// console.log({ BASE_URL: import.meta.env.BASE_URL, env: import.meta.env, basename })

export default [
  ...prefix(`${basename}`, [
    index('routes/market.tsx'),
    route(PAGE_SLUG_INVENTORY, 'routes/inventory.tsx'),
    route(PAGE_SLUG_PRODUCTS, 'routes/products.tsx'),
    route(PAGE_SLUG_LOCATIONS, 'routes/locations.tsx'),
    route(PAGE_SLUG_MOVING_ENTITIES, 'routes/movingEntities.tsx'),
    route(PAGE_SLUG_MAP, 'routes/map.tsx'),
    route(PAGE_SLUG_HISTORY, 'routes/history.tsx'),
    route('*?', 'routes/404.tsx'), // MEOW =^-^=
  ]),
] satisfies RouteConfig
