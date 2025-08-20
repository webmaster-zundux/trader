import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { memo } from 'react'
import { cn } from '../utils/ui/ClassNames'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  primary?: boolean
  fluid?: boolean
  size?: 'tiny' | 'small' | 'big'
  transparent?: boolean
  transparentOnDefaultState?: boolean
  noPadding?: boolean
  noBorder?: boolean
  asInitial?: boolean
  isAlwaysVisible?: boolean
  asLink?: boolean
  noCapitalize?: boolean
  ref?: React.Ref<HTMLButtonElement | null> | undefined
}
export const Button = memo(function Button({
  primary,
  fluid = false,
  size,
  transparent = false,
  transparentOnDefaultState = false,
  noPadding = false,
  noBorder = false,
  asInitial = false,
  isAlwaysVisible = false,
  asLink,
  noCapitalize = false,
  ref,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const classNames = cn([
    styles.Button,
    fluid && styles.Fluid,
    (size === 'tiny') && styles.Tiny,
    (size === 'small') && styles.Small,
    (size === 'big') && styles.Big,
    primary && styles.Primary,
    transparent && styles.Transparent,
    transparentOnDefaultState && styles.TransparentOnDefaultState,
    noPadding && styles.NoPadding,
    noBorder && styles.NoBorder,
    asInitial && styles.AsInitial,
    asLink && styles.AsLink,
    noCapitalize && styles.NoCapitalize,
    isAlwaysVisible && styles.IsAlwaysVisible,
  ])

  return (
    <button
      ref={ref}
      className={classNames}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
})
