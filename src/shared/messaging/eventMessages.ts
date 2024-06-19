import { RollCombos, RollData } from '@root/src/scrapers/lightgg'

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
  itemHash: number
  itemIID: string
  rollsCommunityAvg: RollData[]
  rollCombos: RollCombos

  constructor(itemHash: number, itemUUID: string, rollsCommunityAvg: RollData[], rollCombos: RollCombos) {
    super()
    this.name = MsgNames.AddItemInfoToSidepanel
    this.itemHash = itemHash
    this.itemIID = itemUUID
    this.rollsCommunityAvg = rollsCommunityAvg
    this.rollCombos = rollCombos
  }
}
