export async function createWindow(url: string): Promise<number> {
  const window = await chrome.windows.create({ url: url, type: 'popup', state: 'minimized' });
  let tabId: number = null;
  if (window) {
    tabId = window.tabs[0].id;
    console.log('[Dim+ Background] popup opened from extension ' + url);
  } else {
    console.log("[Dim+ Background] can't open popup");
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
  }

  return tabId;
}

export async function updateWindow(url: string, tabId: number): Promise<number> {
  const tab: chrome.tabs.Tab = await chrome.tabs.update(tabId, { url: url });
  let newTabId: number;
  if (tab) {
    newTabId = tab.id;
    console.log('[Dim+ Background] popup updated from extension ' + url);
  } else {
    console.error("[Dim+ Background] can't update popup");
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
  }

  return newTabId;
}

export async function executeScriptGetElement(tabId: number, selector: string): Promise<string> {
  const results: chrome.scripting.InjectionResult[] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDOMBySelector,
    args: [selector],
  });

  if (results && results.length > 0) {
    return results[0].result;
  } else {
    console.error(`[Dim+ Background] error executing GetElement on tab ${tabId}`);
    return null;
  }
}

function getDOMBySelector(selectorArg: string): string {
  let selectorObj: HTMLElement;
  if (selectorArg) {
    selectorObj = document.querySelector(selectorArg);
    if (!selectorObj) return null;
  } else {
    selectorObj = document.documentElement;
  }
  return selectorObj.outerHTML;
}
