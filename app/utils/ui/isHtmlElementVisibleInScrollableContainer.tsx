export function isHtmlElementVisibleInScrollableContainer(
  element: HTMLElement,
  parentElement: HTMLElement | null = null
): boolean {
  const boundingClientRect = element.getBoundingClientRect()
  const parent = parentElement || element.parentElement || window.document.body
  const parentBoundingClientRect = parent?.getBoundingClientRect()

  if (
    (boundingClientRect.top >= parentBoundingClientRect.top)
    && (boundingClientRect.bottom <= parentBoundingClientRect.bottom)
    && (boundingClientRect.left >= parentBoundingClientRect.left)
    && (boundingClientRect.right <= parentBoundingClientRect.right)
  ) {
    return true
  }

  return false
}
