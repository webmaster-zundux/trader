import { memo } from 'react'
import { NavLink } from 'react-router'
import { APP_PAGE_TITLE } from '../App.const'
import { cn } from '../utils/ui/ClassNames'
import { ImportExportStorageState } from './ImportExportStorageDataActionButtonGroup'
import { mainNavLinks } from './Navbar.const'
import styles from './Navbar.module.css'
import { PreferedColorThemeSwitch } from './PreferedColorThemeSwitch'

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
      <NavLink
        to={link.slug}
        className={navLinkClassName}
      >
        {link.text}
      </NavLink>
    </li>
  )
})

interface PageLinkListProps {
  pageLinks: PageLink[]
}
export const PageLinkList = memo(function PageLinkList({
  pageLinks,
}: PageLinkListProps) {
  return (
    <ul className={styles.LinksList}>
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
  return (
    <nav className={styles.Navbar}>
      <div className={styles.HeaderContainer}>
        <div className={styles.Logo}>
          {APP_PAGE_TITLE}
        </div>

        <ImportExportStorageState />

        <PreferedColorThemeSwitch />
      </div>

      <PageLinkList pageLinks={mainNavLinks} />
    </nav>
  )
})
