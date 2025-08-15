// import { HashRouter, Route, Routes } from 'react-router'
// import { HistoryPage } from '~/pages/HistoryPage'
// import { InventoryPage } from '~/pages/InventoryPage'
// import { LocationsPage } from '~/pages/LocationsPage/LocationsPage'
// import { MapPage } from '~/pages/MapPage/MapPage'
// import { MarketPage } from '~/pages/MarketPage/MarketPage'
// import { MovingEntitiesPage } from '~/pages/MovingEntities/MovingEntitiesPage'
// import { NoMatchPage } from '~/pages/NoMatchPage'
// import { ProductsPage } from '~/pages/ProductsPage/ProductsPage'
// import { PAGE_SLUG_HISTORY, PAGE_SLUG_INVENTORY, PAGE_SLUG_LOCATIONS, PAGE_SLUG_MAP, PAGE_SLUG_MARKET, PAGE_SLUG_MOVING_ENTITIES, PAGE_SLUG_PRODUCTS } from '~/router/PageSlugs.const'
// import { Navbar } from './components/Navbar'
// import { NotificationList } from './components/notifications/NotificationList'
// import { storagesRequiredForDemo, USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA } from './stores/checkIfDemoDataCouldBeLoaded'
// import { useLoadingPersistStorages } from './stores/hooks/useLoadingPersistStorages'

// function HashRouterPageLayout() {
//   return (
//     <>
//       <HashRouter>
//         {/* <HashRouter basename={import.meta.env.BASE_URL}> */}
//         <Navbar />

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

//         <NotificationList />
//       </HashRouter>
//     </>
//   )
// }

// function DefaultAppRoot() {
//   return (
//     <HashRouterPageLayout />
//   )
// }

// function AppRootWithPersistentDataCheck() {
//   useLoadingPersistStorages(storagesRequiredForDemo)

//   return (
//     <HashRouterPageLayout />
//   )
// }

// let HashRouterApp = DefaultAppRoot

// if (USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA) {
//   HashRouterApp = AppRootWithPersistentDataCheck
// }

// export default HashRouterApp
