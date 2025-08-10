import type { Config } from '@react-router/dev/config'
import { loadEnv } from 'vite'
// import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from './app/router/PageSlugs.const'

const env = loadEnv('', process.cwd(), '')

// read `basename` from env variable because `import.meta.env.BASE_URL` is available only code that processed by vite
const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'
// console.log({ BASE_URL: import.meta.env.BASE_URL, basename })

export default {
  basename,
  ssr: false,
  // prerender: true,
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
