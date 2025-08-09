import type { Config } from '@react-router/dev/config'
import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from './app/router/PageSlugs.const'

export default {
  ssr: false,
  prerender: [
    `${import.meta.env.BASE_URL}${PAGE_SLUG_MARKET}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_HISTORY}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_INVENTORY}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_LOCATIONS}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_MOVING_ENTITIES}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_MAP}`,
    `${import.meta.env.BASE_URL}${PAGE_SLUG_PRODUCTS}`,
  ],
} satisfies Config
