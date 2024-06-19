import { MsgBase, MsgInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'
import { LIGHTGG_MAIN_COLUMN_SELECTOR, LightGGItemUrl } from '../../scrapers/lightgg'
import { getOrCreateWindow, getWindowContent } from './window'

export function setEventMessageListener() {
  chrome.runtime.onMessage.addListener((msg: MsgBase, sender, sendResponse) => {
    console.log(`[DIM+ Background] recieved message ${msg.name} from ${sender.tab}`)

    switch (msg.name) {
      case MsgNames.InventoryItemClick:
        ;(async () => sendResponse(await onRecievedInventoryItemClick(msg as MsgInventoryItemClick)))()
        return true
        break
    }

    return false
  })
}

//shouldnt use the same model for request AND response, but its easier to maintain state this way for now.
async function onRecievedInventoryItemClick(msg: MsgInventoryItemClick): Promise<MsgInventoryItemClick> {
  const url = LightGGItemUrl(msg.itemHash)
  msg.responseTabId = await getOrCreateWindow(url, msg.tabId)
  msg.responseTabContent = await getWindowContent(msg.responseTabId, LIGHTGG_MAIN_COLUMN_SELECTOR)

  //closing the tab after getting  the contents should be a setting
  //closeWindow(msg.responseTabId)
  return msg
}
