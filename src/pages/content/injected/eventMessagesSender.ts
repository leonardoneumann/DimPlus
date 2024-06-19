import { RollCombos, RollData } from '@root/src/scrapers/lightgg'
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

export async function sendItemClickToSidepanel(
  itemHash: number,
  itemIID: string,
  rollsCommunityAvg: RollData[],
  rollCombos: RollCombos,
) {
  const msg = new MsgAddItemInfoToSidepanel(itemHash, itemIID, rollsCommunityAvg, rollCombos)
  await chrome.runtime.sendMessage(msg)
}
