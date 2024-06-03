export function findParentElementByClassName(
  className: string,
  targetElement: HTMLDivElement,
  topLevels: number,
): HTMLDivElement {
  if (targetElement.classList[0] === className) {
    return targetElement
  } else if (targetElement.parentElement instanceof HTMLDivElement && topLevels > 0) {
    topLevels--
    return findParentElementByClassName(className, targetElement.parentElement, topLevels)
  }
  return null
}

export function findChildElementByClassName(className: string, targetElement: HTMLDivElement): HTMLDivElement {
  if (targetElement.classList[0] === className) {
    return targetElement
  } else {
    for (const elementItem of targetElement.children) {
      if (elementItem instanceof HTMLDivElement && elementItem.classList[0] === className) {
        return elementItem as HTMLDivElement
      }
    }
  }
}
