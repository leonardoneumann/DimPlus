import { getItemByIID } from '@root/src/dim/storage/inventory'
import { findParentElementByClassName, findChildElementByClassName } from '@src/shared/utils/dom'
import { sendItemClickToBackground, sendItemClickToSidepanel } from './eventMessagesSender'
import { parseCommunityAvgRolls, parseCommunityRollCombos } from '../../../scrapers/lightgg'

const itemDragContainerClassName = 'item-drag-container'
const itemElementClassName = 'item'
const parentElementDeepLevel = 2

let activeOpenedTabId: number = null
let lastItemIID: string = null

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

    if (itemIID !== null && lastItemIID !== itemIID) {
      lastItemIID = itemIID
      const item = await getItemByIID(itemIID)

      if (item !== null) {
        console.log(`Item id is ${item.itemHash}`)

        const response = await sendItemClickToBackground(item.itemHash, activeOpenedTabId)

        if (response) {
          activeOpenedTabId = response.responseTabId
          const avgRolls = parseCommunityAvgRolls(response.responseTabContent)
          const avgCombos = parseCommunityRollCombos(response.responseTabContent)
          sendItemClickToSidepanel(item.itemHash, item.itemInstanceId, avgRolls, avgCombos)
        }
      }
    }
  }
}
