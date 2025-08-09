import { memo, type AnchorHTMLAttributes, type PropsWithChildren } from 'react'
import { Link } from 'react-router'

interface StaticLinkProps extends PropsWithChildren, AnchorHTMLAttributes<HTMLAnchorElement> {

}
export const StaticLink = memo(function StaticLink({
  children,
  href,
  ...rest
}: StaticLinkProps) {
  if (!href) {
    return (
      <a {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  )
})
