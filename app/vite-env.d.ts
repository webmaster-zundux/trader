/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { type memo } from 'react'
declare module 'react' { // augments React types
  // or use ```export const typedMemo: <T>(c: T) => T = React.memo```
  // origin https://stackoverflow.com/a/60389122/10146830
  function memo<A, B>(Component: (props: A) => B): (props: A) => B
  // return type is same as ReturnType<ExoticComponent<any>>
}

declare const __APP_VERSION__: string
