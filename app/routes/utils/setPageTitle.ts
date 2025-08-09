export function setHtmlDocumentPageTitle(
  pageTitle?: string
) {
  const pageTitleElement = window.document.head.querySelector('title')

  if (!pageTitleElement) {
    return
  }

  pageTitleElement.innerText = pageTitle || ''
}
