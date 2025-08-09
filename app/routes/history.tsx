import { HistoryPage } from '~/pages/HistoryPage'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString('History') },
  ]
}

export default function History() {
  return <HistoryPage />
}
