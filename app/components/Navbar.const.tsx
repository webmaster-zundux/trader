import { PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from '../router/PageSlugs.const'
import type { PageLink } from './Navbar'

export const mainNavLinks: PageLink[] = [
  { slug: `${import.meta.env.BASE_URL}`, text: 'market' },
  { slug: `${import.meta.env.BASE_URL}${PAGE_SLUG_LOCATIONS}`, text: 'locations' },
  { slug: `${import.meta.env.BASE_URL}${PAGE_SLUG_MAP}`, text: 'map' },
  { slug: `${import.meta.env.BASE_URL}${PAGE_SLUG_PRODUCTS}`, text: 'products' },
  { slug: `${import.meta.env.BASE_URL}${PAGE_SLUG_MOVING_ENTITIES}`, text: 'moving objects' },
]
