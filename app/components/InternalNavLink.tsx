import { memo, useCallback, type RefAttributes } from 'react'
import { NavLink, type NavLinkProps, type NavLinkRenderProps } from 'react-router'
import { cn } from '~/utils/ui/ClassNames'
import styles from './InternalNavLink.module.css'

export const InternalNavLink = memo(function Link({
  to,
  className,
  children,
  ...rest
}: NavLinkProps & RefAttributes<HTMLAnchorElement>) {
  const additionalCssClassNames = useCallback(function internalLinkAdditionalCssClassNames(props: NavLinkRenderProps): string | undefined {
    if (typeof className === 'function') {
      return cn([styles.InternalNavLink, className(props)])
    }

    return cn([styles.InternalNavLink, className])
  }, [className])

  return (
    <NavLink
      to={to}
      className={additionalCssClassNames}
      {...rest}
    >
      {children}
    </NavLink>
  )
})
