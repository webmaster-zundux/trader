import { useEffect } from 'react'
import { setHtmlDocumentPageTitle } from '~/routes/utils/setPageTitle'

export function usePageTitle(pageTitle?: string) {
  useEffect(function updatePageTitleEffect() {
    setHtmlDocumentPageTitle(pageTitle)
  }, [pageTitle])
}
