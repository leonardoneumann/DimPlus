let activeTabWindow: chrome.windows.Window = null

export const popupWindowDefaultParams: chrome.windows.CreateData = { type: 'popup', state: 'minimized' }

export async function getActiveTabId(url: string): Promise<number> {
  if (!activeTabWindow) {
    activeTabWindow = await createWindow(url)
    return activeTabWindow.tabs[0].id
  } else {
    const tab = await chrome.tabs.get(activeTabWindow.tabs[0].id)
    if (tab) {
      if (tab.url !== url) {
        return await updateWindow(url, tab.id)
      } else {
        return tab.id
      }
    } else {
      const activeTabWindow = await createWindow(url)
      return activeTabWindow.tabs[0].id
    }
  }
}

// return tabId for the newly created window
export async function createWindow(
  url: string,
  params: chrome.windows.CreateData = popupWindowDefaultParams,
): Promise<chrome.windows.Window> {
  const window = await chrome.windows.create({ ...params, url: url })
  if (window) {
    console.log('[Dim+ Background] popup opened from extension ' + url)
  } else {
    console.log('[Dim+ Background] cant open popup')
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
  }

  return window
}

export async function updateWindow(url: string, tabId: number): Promise<number> {
  const tab: chrome.tabs.Tab = await chrome.tabs.update(tabId, { url: url })
  let newTabId: number
  if (tab) {
    newTabId = tab.id
    console.log('[Dim+ Background] popup updated from extension ' + url)
  } else {
    console.error('[Dim+ Background] cant update popup')
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError)
  }

  return newTabId
}

export async function executeScriptGetElement(tabId: number, selector: string): Promise<string> {
  const results: chrome.scripting.InjectionResult[] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDOMBySelector,
    args: [selector],
  })

  if (results && results.length > 0) {
    return results[0].result
  } else {
    console.error(`[Dim+ Background] error executing GetElement on tab ${tabId}`)
    return null
  }
}

function getDOMBySelector(selectorArg: string): string {
  let selectorObj: HTMLElement
  if (selectorArg) {
    selectorObj = document.querySelector(selectorArg)
    if (!selectorObj) return null
  } else {
    selectorObj = document.documentElement
  }
  return selectorObj.outerHTML
}
