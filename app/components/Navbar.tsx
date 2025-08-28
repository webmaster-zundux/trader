import { memo, useEffect } from 'react'
import { useLocation } from 'react-router'
import { hideMobileNavMenu, showMobileNavMenu, useMobileNavMenuVisibility } from '~/stores/simple-stores/MobileNavMenu.store'
import { APP_NAME } from '../App.const'
import { cn } from '../utils/ui/ClassNames'
import { Button } from './Button'
import { ImportExportStorageState } from './ImportExportStorageDataActionButtonGroup'
import { InternalNavLink } from './InternalNavLink'
import { MAIN_NAV_BAR_LINKS } from './Navbar.const'
import styles from './Navbar.module.css'
import { PreferedColorThemeSwitch } from './PreferedColorThemeSwitch'
import { Icon } from './Icon'

export type PageLink = {
  slug: string
  text: string
}

interface NavLinkItemProps {
  isActive: boolean
  isPending: boolean
  isTransitioning: boolean
};

interface LinkListItemProps {
  link: PageLink
}
const LinkListItem = memo(function LinkListItem({
  link,
}: LinkListItemProps) {
  const navLinkClassName = ({
    isActive,
    isPending,
    isTransitioning,
  }: NavLinkItemProps) => cn([
    styles.NavLink,
    isPending && styles.Pending,
    isActive && styles.Active,
    isTransitioning && styles.Transitioning,
  ])

  return (
    <li className={styles.LinkListItem}>
      <InternalNavLink
        to={link.slug}
        className={navLinkClassName}
      >
        {link.text}
      </InternalNavLink>
    </li>
  )
})

interface PageLinkListProps {
  pageLinks: PageLink[]
}
export const PageLinkList = memo(function PageLinkList({
  pageLinks,
}: PageLinkListProps) {
  const isVisibleMobileNavMenu = useMobileNavMenuVisibility(state => state.isVisible)

  return (
    <ul className={cn([
      styles.LinksList,
      styles.MobileNavMenu,
      isVisibleMobileNavMenu && styles.VisibleMobileNavMenu,
    ])}
    >
      {pageLinks.map(link => (
        <LinkListItem
          key={link.slug}
          link={link}
        />
      ))}
    </ul>
  )
})

export const Navbar = memo(function Navbar() {
  const isVisibleMobileNavMenu = useMobileNavMenuVisibility(state => state.isVisible)
  const location = useLocation()

  useEffect(function trackingLocationPathNameChangeEffect() {
    if (location.pathname) {
      // noop - just tracking updates
    }

    hideMobileNavMenu()
  }, [location.pathname])

  return (
    <nav className={styles.Navbar}>
      <div className={styles.HeaderContainer}>
        <div className={styles.Logo}>
          {APP_NAME}
        </div>

        <ImportExportStorageState />

        <PreferedColorThemeSwitch />
      </div>

      <div className={cn([
        styles.HeaderContainer,
        styles.MobileNavMenuActionButtons
      ])}
      >
        {isVisibleMobileNavMenu && (
          <Button
            noPadding
            transparent
            onClick={hideMobileNavMenu}
            title="hide menu"
          >
            <Icon name="close" />
          </Button>
        )}

        {!isVisibleMobileNavMenu && (
          <Button
            noPadding
            transparent
            onClick={showMobileNavMenu}
            title="show menu"
          >
            <Icon name="menu" />
          </Button>
        )}
      </div>

      <PageLinkList pageLinks={MAIN_NAV_BAR_LINKS} />
    </nav>
  )
})
