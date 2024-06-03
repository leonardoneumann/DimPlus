import { getItemByIID } from '@root/src/dim/storage/inventory'
import { findParentElementByClassName, findChildElementByClassName } from '@src/shared/utils/dom'
import { sendCreateWindow, sendGetWindowContents } from './connection'
import { LIGHTGG_COMMUNITY_AVG_ELEMID, LightGGItemUrl } from '../scrapers/lightgg'

const itemDragContainerClassName = 'item-drag-container'
const itemElementClassName = 'item'
const parentElementDeepLevel = 2

export async function onItemClick(event: MouseEvent) {
  if (event.target instanceof HTMLDivElement) {
    const targetElem: HTMLDivElement = event.target

    let itemElement = findChildElementByClassName(itemElementClassName, targetElem)
    let itemIID: string = null

    if (itemElement) {
      itemIID = itemElement.id
    } else {
      const itemContainer = findParentElementByClassName(itemDragContainerClassName, targetElem, parentElementDeepLevel)

      if (itemContainer !== null) {
        itemElement = findChildElementByClassName(itemElementClassName, itemContainer)

        itemIID = itemElement.id
      }
    }

    if (itemIID !== null) {
      const item = await getItemByIID(itemIID)

      if (item !== null) {
        console.log(`Item id is ${item.itemHash}`)

        const tabId = await sendCreateWindow(LightGGItemUrl(item.itemHash))
        console.log(`tabId recieved from background ${tabId}`)

        const content = await sendGetWindowContents(tabId, LIGHTGG_COMMUNITY_AVG_ELEMID)
        console.log(content)
      }
    }
  }
}
