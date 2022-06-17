/** @module BackgroundService */


class BackgroundService {

    /**
     * Promise wrapper for chrome.runtime.sendMessage
     * @param tabId
     * @param item
     * @returns {Promise<any>}
     */
    static #sendMessagePromise(msgObj) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(msgObj, response => {
                resolve(response);
            });
        });
    }

    /**
     * Opens a new or existing window, executes a function and returns the result.
     * @param {string} url target url to load into the popup
     * @param {string} [params] Window creation params , if not defined it will create a minimized popup. see https://developer.chrome.com/docs/extensions/reference/windows/
     * @param {string} [executeFunction] element selector function, if empty will default to return body InnerHTML. Can oly contain standard javascript
     * @param {string} [executeFunctionString] element selector function already converted to string.
     * @returns {string} the result of the function executed in the popup
     */
    static async OpenWindowAndExecute({url, params, executeFunction, executeFunctionString}) {
        let windowParams;
        if (params) {
            windowParams = {...params, url: url}
        } else {
            windowParams = {url: url, type: 'popup', state: 'minimized'}
        }

        let openPopUpResponse = await this.#sendMessagePromise({ open_window: windowParams })

        if (openPopUpResponse) {

            executeFunction = executeFunctionString || executeFunction || function() {
                let elem = document.body
                return  (elem && elem.innerHTML) ? document.body.innerHTML : null
            }

            let executeResponse = await this.#sendMessagePromise({
                execute: { tabId: openPopUpResponse.tabId, script: executeFunction.toString() } 
            })

            if (executeResponse && executeResponse.results) {
                return executeResponse.results[0]
            }
        } else {
            console.log("BackgroundService: Can't open popup")
        }

        return null;
    }

    static async CloseWindow() {
        return await this.#sendMessagePromise({ close: true })
    }

}