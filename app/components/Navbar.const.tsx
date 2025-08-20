import { PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from '~/routes'
import type { PageLink } from './Navbar'

export const MAIN_NAV_BAR_LINKS: PageLink[] = [
  { slug: PAGE_SLUG_MARKET, text: 'market' },
  { slug: PAGE_SLUG_LOCATIONS, text: 'locations' },
  { slug: PAGE_SLUG_MAP, text: 'map' },
  { slug: PAGE_SLUG_PRODUCTS, text: 'products' },
  { slug: PAGE_SLUG_MOVING_ENTITIES, text: 'moving objects' },
]
