export const BackgroundPortName = 'dimplus-background-connection-port'

export enum BackgroundMsgNames {
  CreateWindow = 'BackgroundMsgCreateWindow',
  GetWindowContent = 'BackgroundMsgGetWindowContent',
}

export interface BackgroundMsgBase {
  name: BackgroundMsgNames
}

export interface BackgroundMsgCreateWindow extends BackgroundMsgBase {
  url: string
  returnTabId?: number
}

export interface BackgroundMsgGetWindowContent extends BackgroundMsgBase {
  elementName: string
  returnContent?: string
}
