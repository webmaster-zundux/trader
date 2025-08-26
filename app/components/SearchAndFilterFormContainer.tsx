import { memo, type PropsWithChildren } from 'react'
import styles from './SearchAndFilterFormContainer.module.css'

export const SearchAndFilterFormContainer = memo(function SearchAndFilterFormContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className={styles.SearchAndFilterFormContainer}>
      {children}
    </div>
  )
})
