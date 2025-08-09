import { memo, type PropsWithChildren } from 'react'
import styles from './SearchFormAndTableContainer.module.css'

export const SearchFormAndTableContainer = memo(function SearchFormAndTableContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className={styles.Container}>
      {children}
    </div>
  )
})
