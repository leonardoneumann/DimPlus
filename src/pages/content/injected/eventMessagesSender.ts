import { MsgEventInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'

export async function sendInventoryItemClickEventMessage(itemHash: number): Promise<string> {
  const msg: MsgEventInventoryItemClick = { name: MsgNames.InventoryItemClick, itemHash: itemHash }
  const ret = await chrome.runtime.sendMessage(msg)
  return ret
}
