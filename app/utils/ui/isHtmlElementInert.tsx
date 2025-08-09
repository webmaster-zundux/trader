export function isHtmlElementInert(element: HTMLElement): boolean {
  return element.getAttribute('inert') !== null
}
