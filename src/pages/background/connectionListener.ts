import {
  BackgroundPortName,
  BackgroundMsgBase,
  BackgroundMsgNames,
  BackgroundMsgCreateWindow,
  BackgroundMsgGetWindowContent,
} from '@root/src/shared/messaging/backgroundMsg'

let connectionPort: chrome.runtime.Port

export function setConnectionListener() {
  chrome.runtime.onConnect.addListener(connected)
}

function connected(incomingPort: chrome.runtime.Port) {
  if (incomingPort.name !== BackgroundPortName) {
    console.log(`[Dim+ Background] unknown port name tried to connect, name: ${incomingPort.name}`)
    return
  }

  connectionPort = incomingPort

  console.log('[Dim+ Background] Connection set !')

  connectionPort.onDisconnect.addListener((port: chrome.runtime.Port) => {
    console.error(`[Dim+ Background] client script disconnected ${port.name}`)
  })

  connectionPort.onMessage.addListener((msg: BackgroundMsgBase) => {
    console.log('In background script, received message from content script')

    switch (msg.name) {
      case BackgroundMsgNames.CreateWindow:
        onReceivedCreateWindow(msg as BackgroundMsgCreateWindow)
        break
      case BackgroundMsgNames.GetWindowContent:
        onReceivedGetWindowContent(msg as BackgroundMsgGetWindowContent)
        break
    }
  })
}

function onReceivedCreateWindow(msg: BackgroundMsgCreateWindow) {
  connectionPort.postMessage(msg)
}

function onReceivedGetWindowContent(msg: BackgroundMsgGetWindowContent) {
  console.log(`content script sends CreateWindow with url ${msg.elementName}`)
  msg.returnContent = 'sadasasd'
  connectionPort.postMessage(msg)
}
