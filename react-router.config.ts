import type { Config } from '@react-router/dev/config'
import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from './app/router/PageSlugs.const'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')
const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'
// console.log({ BASE_URL: import.meta.env.BASE_URL, basename })

export default {
  basename,
  ssr: false,
  // prerender: [
  //   `${PAGE_SLUG_MARKET}`, // ${basename}
  //   `${PAGE_SLUG_HISTORY}`, // ${basename}
  //   `${PAGE_SLUG_LOCATIONS}`, // ${basename}
  //   `${PAGE_SLUG_INVENTORY}`, // ${basename}
  //   `${PAGE_SLUG_MOVING_ENTITIES}`, // ${basename}
  //   `${PAGE_SLUG_MAP}`, // ${basename}
  //   `${PAGE_SLUG_PRODUCTS}`, // ${basename}
  // ],
} satisfies Config
