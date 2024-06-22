import { ItemInfo } from '@root/src/shared/d2items/itemInfo'
import { MsgAddItemInfoToSidepanel, MsgInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'
import { fetchAny as cacheFetchAny } from '@root/src/shared/utils/cache'

export async function sendItemClickToBackground(
  itemHash: number,
  tabId?: number,
): Promise<MsgInventoryItemClick | false> {
  const msg = new MsgInventoryItemClick(itemHash, tabId)

  return await cacheFetchAny(
    `${MsgNames.InventoryItemClick}-${itemHash}`,
    async () => await chrome.runtime.sendMessage(msg),
  )
}

export async function sendItemClickToSidepanel(itemInfo: ItemInfo) {
  const msg = new MsgAddItemInfoToSidepanel(itemInfo)
  await chrome.runtime.sendMessage(msg)
}
