export function findLabelAnchorHtmlElement(
  itemUuid: string,
  containerHtmlElement: HTMLDivElement
): HTMLDivElement | undefined {
  return containerHtmlElement.querySelector<HTMLDivElement>(`[data-item-uuid="${itemUuid}"]`) || undefined
}
