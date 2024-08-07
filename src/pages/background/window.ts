export const popupWindowDefaultParams: chrome.windows.CreateData = { type: 'popup', state: 'minimized' }

export async function getOrCreateWindow(url: string, tabId?: number): Promise<number> {
  if (!tabId) {
    return (await createWindow(url)).id
  } else {
    try {
      const tab = await chrome.tabs.get(tabId)
      if (tab.url !== url) {
        const updatedTab = await updateWindow(url, tab.id)
        return updatedTab.id
      }
    } catch {
      return (await createWindow(url)).id
    }
  }
}

export async function getWindowContent(tabId: number, selector: string): Promise<string> {
  return await executeScriptGetElement(tabId, selector)
}

// return tabId for the newly created window
async function createWindow(
  url: string,
  params: chrome.windows.CreateData = popupWindowDefaultParams,
): Promise<chrome.tabs.Tab> {
  const window = await chrome.windows.create({ ...params, url: url })
  if (window && window.tabs[0]) {
    console.log('[Dim+ Background] popup opened from extension ' + url)
    return window.tabs[0]
  } else {
    console.log('[Dim+ Background] cant open popup')
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
  }
  return null
}

async function updateWindow(url: string, tabId: number): Promise<chrome.tabs.Tab> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const tab: chrome.tabs.Tab = await chrome.tabs.update(tabId, { url: url })
    if (!tab) {
      reject(chrome.runtime.lastError || 'cant update popup')
    }
    const updateListener = async (updatedTabId, info, updatedTab) => {
      if (info.status === 'complete' && updatedTabId === tabId) {
        chrome.tabs.onUpdated.removeListener(updateListener)
        resolve(updatedTab)
      }
    }
    chrome.tabs.onUpdated.addListener(updateListener)
  })
}

export async function closeWindow(tabId: number) {
  try {
    await chrome.tabs.remove(tabId)
  } catch {
    console.log('[Dim+ Background] tab already closed')
  }
}

async function executeScriptGetElement(tabId: number, selector: string): Promise<string> {
  const results: chrome.scripting.InjectionResult[] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDOMBySelector,
    args: [selector],
  })

  if (results && results[0] && results[0].result) {
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
