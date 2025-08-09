import { APP_PAGE_TITLE } from '~/App.const'

export function createPageTitleString(
  pageTitle?: string
) {
  if (!pageTitle) {
    return `${APP_PAGE_TITLE}`
  }

  return `${pageTitle} - ${APP_PAGE_TITLE}`
}
