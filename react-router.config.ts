import type { Config } from '@react-router/dev/config'
import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from './app/router/PageSlugs.const'

export default {
  ssr: false,
  prerender: [
    `/${PAGE_SLUG_MARKET}`,
    `/${PAGE_SLUG_HISTORY}`,
    `/${PAGE_SLUG_INVENTORY}`,
    `/${PAGE_SLUG_LOCATIONS}`,
    `/${PAGE_SLUG_MOVING_ENTITIES}`,
    `/${PAGE_SLUG_MAP}`,
    `/${PAGE_SLUG_PRODUCTS}`,
  ],
} satisfies Config
