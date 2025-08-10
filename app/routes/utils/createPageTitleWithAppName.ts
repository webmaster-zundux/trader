import { APP_NAME } from '~/App.const'

export function createPageTitleWithAppName(
  pageTitle?: string
) {
  if (!pageTitle) {
    return `${APP_NAME}`
  }

  return `${pageTitle} - ${APP_NAME}`
}
