import type { Config } from '@react-router/dev/config'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')

// read `basename` from env variable because `import.meta.env.BASE_URL` is available only code that processed by vite
const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'
// console.log({ BASE_URL: import.meta.env.BASE_URL, basename })

export default {
  basename,
  ssr: false,
  // prerender: true,
  // prerender: [
  //   ``
  // ]
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
