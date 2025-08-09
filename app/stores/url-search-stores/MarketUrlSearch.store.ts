import { createUrlSearchStore } from '../createUrlSearchStore'

type MarketUrlSearchStore = {
  productName: string
  setProductName: (newProductName: string) => void
}

export const useMarketUrlSeachStore = createUrlSearchStore<MarketUrlSearchStore>(
  'marketUrlSearchStore',
  (set, get) => ({
    productName: '',
    setProductName(newProductName) {
      if (get().productName !== newProductName) {
        set(() => ({
          productName: newProductName,
        }))
      }
    },
  })
)
