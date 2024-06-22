import { ItemInfo } from '../d2items/itemInfo'

export enum MsgNames {
  InventoryItemClick = 'MsgInventoryItemClick',
  AddItemInfoToSidepanel = 'MsgAddItemInfoToSidepanel',
}

export class MsgBase {
  name: MsgNames
}

export class MsgInventoryItemClick extends MsgBase {
  itemHash: number
  tabId?: number
  responseTabId?: number
  responseTabContent?: string

  constructor(itemHash: number, tabId?: number) {
    super()
    this.itemHash = itemHash
    this.tabId = tabId
    this.name = MsgNames.InventoryItemClick
  }
}

export class MsgAddItemInfoToSidepanel extends MsgBase {
  itemInfo: ItemInfo

  constructor(itemInfo: ItemInfo) {
    super()
    this.name = MsgNames.AddItemInfoToSidepanel
    this.itemInfo = itemInfo
  }
}
