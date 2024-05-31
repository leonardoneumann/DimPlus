import {
  backgroundPortName,
  BackgroundMsgCreateWindow,
  BackgroundMsgNames,
  BackgroundMsgGetWindowContent,
  BackgroundMsgBase,
} from '@root/src/shared/messaging/backgroundMsg';

let connectionPort: chrome.runtime.Port;

export function setConnection() {
  connectionPort = chrome.runtime.connect({ name: backgroundPortName });
  connectionPort.onMessage.addListener(msg => {
    console.log('In background script, received message from content script');

    switch (msg.name) {
      case BackgroundMsgNames.CreateWindow:
        console.log(`returned tab id ${(msg as BackgroundMsgCreateWindow).returnTabId}`);
        break;
      case BackgroundMsgNames.GetWindowContent:
        break;
    }
  });
}

async function callPortMessage(msg: BackgroundMsgBase): Promise<BackgroundMsgBase> {
  return new Promise(resolve => {
    const listener = response => {
      connectionPort.onMessage.removeListener(listener);
      resolve(response);
    };
    connectionPort.postMessage(msg);
    connectionPort.onMessage.addListener(listener);
  });
}

export async function sendCreateWindow(url: string): Promise<number> {
  const msg: BackgroundMsgCreateWindow = { name: BackgroundMsgNames.CreateWindow, url: url };

  const result = (await callPortMessage(msg)) as BackgroundMsgCreateWindow;

  return result.returnTabId;
}

export async function sendGetWindowContents(tabId: number, elementName: string): Promise<string> {
  const msg: BackgroundMsgGetWindowContent = {
    name: BackgroundMsgNames.GetWindowContent,
    tabId: tabId,
    elementName: elementName,
  };

  const result = (await callPortMessage(msg)) as BackgroundMsgGetWindowContent;

  return result.returnContent;
}
