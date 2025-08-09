import type { PropsWithChildren } from 'react'
import { memo } from 'react'
import styles from './Main.module.css'

export const Main = memo(function Main({
  children,
}: PropsWithChildren) {
  return (
    <main className={styles.Main}>
      {children}
    </main>
  )
})
