/* global chrome */

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { message: 'load' });
});


var lastTabId;
var lastUrl;

var MyPopupWindow = () => {
    //TODO: move all popup logic here
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        // Open pop-up handler
        if (request.open_window) {

            let createPopup = (windowData) => {
                chrome.windows.create(windowData,
                    async (window) => {
                        
                        if (window) {
                            lastTabId = window.tabs[0].id
                            lastUrl = windowData.url
                            console.log("popup opened from extension " + windowData.url)
                        } else {
                            lastTabId = null
                            lastUrl = null
                            console.log("can't open popup")
                            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
                        }
                        
                        sendResponse({tabId: lastTabId, windowId: window.id})
                    }

                )
            }

            if (lastTabId) {
                chrome.tabs.get(lastTabId, async (existingTab) => {
                    if (!existingTab) {
                        if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
                        createPopup(request.open_window)
                    } else {
                        if(lastUrl && lastUrl == request.open_window.url) {
                            sendResponse({ tabId: lastTabId })
                        } else {
                            chrome.tabs.update(lastTabId, { url: request.open_window.url }, 
                                async (tab) => {
                                    if (!tab) {
                                        createPopup(request.open_window)
                                    } else {
                                        //lastUrl = request.open_window.url
                                        //sendResponse({ tabId: tab.id })

                                        let updateListener = (tabId, info) => {
                                            if (info.status === 'complete') {
                                                lastUrl = request.open_window.url
                                                chrome.tabs.onUpdated.removeListener(updateListener);
                                                sendResponse({ tabId: tab.id })
                                            }
                                        }

                                        chrome.tabs.onUpdated.addListener(updateListener);
                                    }
                                }
                            )
                        }
                        
                    }
                })
            } else {
                createPopup(request.open_window)
            }

            //return true to indicate we'll answer asynchronously
            return true
        }

        //Get community rolls from opened pop up
        if(request.execute){
            chrome.tabs.executeScript( request.execute.tabId,
            {   //details
                allFrames: true,
                runAt: 'document_idle',
                code: `(${request.execute.script})()
                `,
            },
                async (injectionResults) => {
                    /*
                    for (const frameResult of injectionResults) {
                        console.log('Frame Title: ' + frameResult)   
                    }
                    */
                    sendResponse({ results: injectionResults })
                }
            )
            return true
        }
    }
);