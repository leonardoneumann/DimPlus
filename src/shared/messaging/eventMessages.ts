export enum MsgNames {
  InventoryItemClick = 'BackgroundMsgInventoryItemClick',
}

export interface MsgBase {
  name: MsgNames
}

export interface MsgEventInventoryItemClick extends MsgBase {
  itemHash: number
}
