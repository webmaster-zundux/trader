import { memo, type RefAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '~/utils/ui/ClassNames'
import styles from './InternalStaticLink.module.css'

export const InternalStaticLink = memo(function InternalStaticLink({
  to,
  className,
  children,
  ...rest
}: LinkProps & RefAttributes<HTMLAnchorElement>) {
  return (
    <Link
      to={to}
      className={cn([styles.InternalStaticLink, className])}
      {...rest}
    >
      {children}
    </Link>
  )
})
