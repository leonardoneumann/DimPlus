import { MsgEventInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'

export async function sendInventoryItemClickEventMessage(
  itemHash: number,
  tabId?: number,
): Promise<MsgEventInventoryItemClick> {
  const msg: MsgEventInventoryItemClick = { name: MsgNames.InventoryItemClick, itemHash: itemHash, tabId: tabId }
  const ret = await chrome.runtime.sendMessage(msg)
  return ret
}
