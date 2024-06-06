import { MsgBase, MsgEventInventoryItemClick, MsgNames } from '@root/src/shared/messaging/eventMessages'
import { getOrCreateWindow, getWindowContent } from './window'
import { LightGGItemUrl, LIGHTGG_COMMUNITYAVG_SELECTOR } from './scrapers/lightgg'

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

async function onRecievedInventoryItemClick(msg: MsgEventInventoryItemClick): Promise<string> {
  await getOrCreateWindow(LightGGItemUrl(msg.itemHash))
  const ret = await getWindowContent(LIGHTGG_COMMUNITYAVG_SELECTOR)
  return ret
}
