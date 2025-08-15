import React from 'react'
import ReactDOM from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
// import HashRouterApp from './HashRouterApp'
// import { HashRouterLayout } from './HashRouterLayout'

// const BASE_URL = import.meta.env.BASE_URL
// const renderForGithubPagesOfProject = (BASE_URL !== '/')

// console.log({ BASE_URL }) // for debug only =^-^=

// if (renderForGithubPagesOfProject) {
//   ReactDOM.createRoot(document).render(
//     <React.StrictMode>
//       {/* <HashRouter basename={BASE_URL}>
//         <Routes>
//           <Route path={PAGE_SLUG_MARKET} element={<MarketPage />} />
//           <Route path={PAGE_SLUG_INVENTORY} element={<InventoryPage />} />
//           <Route path={PAGE_SLUG_PRODUCTS} element={<ProductsPage />} />
//           <Route path={PAGE_SLUG_LOCATIONS} element={<LocationsPage />} />
//           <Route path={PAGE_SLUG_MOVING_ENTITIES} element={<MovingEntitiesPage />} />
//           <Route path={PAGE_SLUG_MAP} element={<MapPage />} />
//           <Route path={PAGE_SLUG_HISTORY} element={<HistoryPage />} />
//           <Route path="*" element={<NoMatchPage />} />
//         </Routes>
//       </HashRouter> */}

//       <HashRouterLayout>
//         <HashRouterApp />
//       </HashRouterLayout>
//     </React.StrictMode>
//   )
// } else {
ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>
)
// }
