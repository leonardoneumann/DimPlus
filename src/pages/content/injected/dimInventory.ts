import { getItemByIID } from '@root/src/dim/storage/inventory'
import { findParentElementByClassName, findChildElementByClassName } from '@src/shared/utils/dom'
import { sendInventoryItemClickEventMessage } from './eventMessagesSender'
import { parseCommunityAvgRolls, parseCommunityRollCombos } from '../../../scrapers/lightgg'

const itemDragContainerClassName = 'item-drag-container'
const itemElementClassName = 'item'
const parentElementDeepLevel = 2

let activeOpenedTabId: number = null

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

        const response = await sendInventoryItemClickEventMessage(item.itemHash, activeOpenedTabId)

        activeOpenedTabId = response.responseTabId

        console.log(parseCommunityAvgRolls(response.responseTabContent))
        console.log(parseCommunityRollCombos(response.responseTabContent))
      }
    }
  }
}
