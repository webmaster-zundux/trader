import { memo, useMemo } from 'react'
import { cn } from '~/utils/ui/ClassNames'
import { svgIconBaseClass, svgIconClassPrefix } from './Icon.const'
import styles from './Icon.module.css'

interface IconProps {
  className?: string
  name:
    | 'add'
    | 'bid_landscape_disabled'
    | 'chevron_right'
    | 'clear'
    | 'close'
    | 'content_copy'
    | 'dark_mode'
    | 'delete_forever'
    | 'description'
    | 'file_download'
    | 'filter_alt'
    | 'filter_alt_off'
    | 'graph_3'
    | 'info'
    | 'ink_eraser'
    | 'light_mode'
    | 'location_disabled'
    | 'location_off'
    | 'location_on'
    | 'location_searching'
    | 'menu'
    | 'monitoring'
    | 'not_listed_location'
    | 'package_2'
    | 'planet_orbit'
    | 'query_stats'
    | 'remove_selection'
    | 'rocket_launch'
    | 'route'
    | 'routine'
    | 'search_category'
    | 'search_off'
    | 'tune'
    | 'upload_file'
  title?: string
}
export const Icon = memo(function Icon({
  className,
  name,
  title,
}: IconProps) {
  const iconElementClassName = useMemo(() => {
    return cn([svgIconBaseClass, `${svgIconClassPrefix}${name}`, styles.Icon, className])
  }, [className, name])

  return (
    <i className={iconElementClassName} title={title}></i>
  )
})
