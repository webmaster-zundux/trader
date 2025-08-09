import { NoMatchPage } from '~/pages/NoMatchPage'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString('404 page not found') },
  ]
}

export default function History() {
  return <NoMatchPage />
}
