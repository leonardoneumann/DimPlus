import { getItemFromIID } from '@root/src/dim/storage/inventory';

const itemDragContainerClassName = 'item-drag-container';
const itemElementClassName = 'item';

export async function onItemClick(event: MouseEvent) {
  if (event.target instanceof HTMLDivElement) {
    const targetElem: HTMLDivElement = event.target;

    const itemElement = getItemChildElement(targetElem);
    let itemIID: string = null;

    if (itemElement) {
      itemIID = itemElement.id;
    } else {
      const itemContainer = getItemParentElementContainer(targetElem, 2);

      if (itemContainer !== null) {
        const itemElement = getItemChildElement(itemContainer);

        itemIID = itemElement.id;
      }
    }

    if (itemIID !== null) {
      const item = await getItemFromIID(itemIID);
      console.log(`Item id is ${item.itemHash}`);
    }
  }
}

function getItemParentElementContainer(needleElem: HTMLDivElement, deep: number): HTMLDivElement {
  if (needleElem.classList[0] === itemDragContainerClassName) {
    return needleElem;
  } else if (needleElem.parentElement instanceof HTMLDivElement && deep > 0) {
    deep--;
    return getItemParentElementContainer(needleElem.parentElement, deep);
  }
  return null;
}

function getItemChildElement(targetElement: HTMLDivElement): HTMLDivElement {
  if (targetElement.classList[0] === itemElementClassName) {
    return targetElement;
  } else {
    for (const elementItem of targetElement.children) {
      if (elementItem instanceof HTMLDivElement && elementItem.classList[0] === itemElementClassName) {
        return elementItem as HTMLDivElement;
      }
    }
  }
}
