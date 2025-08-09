import { MarketPage } from '~/pages/MarketPage/MarketPage'
import { PAGE_TITLE_MARKET } from '~/pages/MarketPage/MarketPage.const'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    {
      title: createPageTitleString(PAGE_TITLE_MARKET)
    },
  ]
}

export default function Market() {
  return <MarketPage />
}
