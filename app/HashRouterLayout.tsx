// import type React from 'react'
// import { APP_ROOT_ELEMENT_ID } from './App.const'
// import { DEFAULT_PREFERED_COLOR_THEME, HTML_BODY_CSS_CLASS_FOR_DARK_THEME, HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME } from './components/PreferedColorThemeSwitch'
// import './Roboto.font.css'
// import './root.css'
// import { cn } from './utils/ui/ClassNames'

// export function HashRouterLayout({ children }: { children: React.ReactNode }) {
//   const bodyClassName = cn([
//     DEFAULT_PREFERED_COLOR_THEME === 'dark' && HTML_BODY_CSS_CLASS_FOR_DARK_THEME,
//     DEFAULT_PREFERED_COLOR_THEME === 'light' && HTML_BODY_CSS_CLASS_FOR_LIGHT_THEME,
//   ])

//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />

//         <meta name="theme-color" content="#eee" />
//         {/* <Meta /> // disabled because since react 19+ all native <meta> and <title> bubble ups to <head> from <body> */}
//         {/* <Links /> // disabled because it is using with <HydratedRouter />  */}

//       </head>

//       <body className={bodyClassName}>

//         <noscript>
//           You need to enable JavaScript to run this app.
//         </noscript>

//         <div id={APP_ROOT_ELEMENT_ID}>
//           {children}
//         </div>

//         {/* <ScrollRestoration /> // disabled because it is using with <HydratedRouter /> */}
//         {/* <Scripts /> // disabled because it is using with <HydratedRouter /> */}

//       </body>

//     </html>
//   )
// }
