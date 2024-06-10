import { MsgBase, MsgEventInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'
import { LIGHTGG_MAIN_COLUMN_SELECTOR, LightGGItemUrl } from '../../scrapers/lightgg'
import { getOrCreateWindow, getWindowContent } from './window'
import { fetchAny as cacheFetchAny } from '@root/src/shared/utils/cache'

export function setEventMessageListener() {
  chrome.runtime.onMessage.addListener((msg: MsgBase, sender, sendResponse) => {
    console.log(`[DIM+ Service] recieved message ${msg.name} from ${sender.tab}`)

    switch (msg.name) {
      case MsgNames.InventoryItemClick:
        ;(async () => sendResponse(await onRecievedInventoryItemClick(msg as MsgEventInventoryItemClick)))()
        break
    }

    return true
  })
}

//shouldnt use the same model for request AND response, but its easier to maintain state this way for now.
async function onRecievedInventoryItemClick(msg: MsgEventInventoryItemClick): Promise<MsgEventInventoryItemClick> {
  const url = LightGGItemUrl(msg.itemHash)
  msg.responseTabId = await getOrCreateWindow(url, msg.tabId)
  const cacheResponse = await cacheFetchAny(
    url,
    async () => await getWindowContent(msg.responseTabId, LIGHTGG_MAIN_COLUMN_SELECTOR),
  )

  if (cacheResponse) msg.responseTabContent = cacheResponse

  return msg
}
