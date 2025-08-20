import { index, route, type RouteConfig } from '@react-router/dev/routes'
import { PAGE_ROUTE_NAME_HISTORY, PAGE_ROUTE_NAME_INVENTORY, PAGE_ROUTE_NAME_LOCATIONS, PAGE_ROUTE_NAME_MAP, PAGE_ROUTE_NAME_MARKET, PAGE_ROUTE_NAME_MOVING_ENTITIES, PAGE_ROUTE_NAME_PRODUCTS } from './router/PageSlugs.const'

export default [
  index('routes/market.tsx'),
  route(PAGE_ROUTE_NAME_LOCATIONS, 'routes/locations.tsx'),
  route(PAGE_ROUTE_NAME_MAP, 'routes/map.tsx'),
  route(PAGE_ROUTE_NAME_PRODUCTS, 'routes/products.tsx'),
  route(PAGE_ROUTE_NAME_MOVING_ENTITIES, 'routes/movingEntities.tsx'),

  route(PAGE_ROUTE_NAME_INVENTORY, 'routes/inventory.tsx'),
  route(PAGE_ROUTE_NAME_HISTORY, 'routes/history.tsx'),

  route('*', 'routes/404.tsx'), // MEOW =^-^=
] satisfies RouteConfig

export const PAGE_SLUG_ROOT = `/${PAGE_ROUTE_NAME_MARKET}`

export const PAGE_SLUG_MARKET = `/${PAGE_ROUTE_NAME_MARKET}`
export const PAGE_SLUG_LOCATIONS = `/${PAGE_ROUTE_NAME_LOCATIONS}`
export const PAGE_SLUG_MAP = `/${PAGE_ROUTE_NAME_MAP}`
export const PAGE_SLUG_PRODUCTS = `/${PAGE_ROUTE_NAME_PRODUCTS}`
export const PAGE_SLUG_MOVING_ENTITIES = `/${PAGE_ROUTE_NAME_MOVING_ENTITIES}`

export const PAGE_SLUG_INVENTORY = `/${PAGE_ROUTE_NAME_INVENTORY}`
export const PAGE_SLUG_HISTORY = `/${PAGE_ROUTE_NAME_HISTORY}`
