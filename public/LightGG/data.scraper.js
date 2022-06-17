/** @module LightGg */

const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'
const LIGHTGG_COMMUNITY_AVG_ELEMID = 'community-average'
const LIGHTGG_MYROLLS_ELEMID = 'my-rolls'
const LIGHTGG_SOCKETS_ELEMID = 'socket-container'
const LIGHTGG_CACHELIFE = 24 * 60 * 3 // 3 days
const LIGHTGG_HTML_CACHEKEY_ROOT = '/lightgg-html'

class LightGgDataScraper {

    /**
     * Retrieves community average usage data for a certain item on Light.gg
     * @param {any} itemId 
     * @returns {ObjectArray} Community roll data objects array
     */
    static async GetItemAvgRolls(itemId) {
        const cacheKey = `${LIGHTGG_HTML_CACHEKEY_ROOT}-${itemId}`

        const fetchData = async () => {
            return await this.#GetHtmlItemDbData({itemId, anchorId: LIGHTGG_COMMUNITY_AVG_ELEMID})
        }

        let html = await CacheManager.fetchAny(cacheKey, fetchData, LIGHTGG_CACHELIFE)

        return html ? LightGgDataParser.ProcessCommunityAvgRollsItemDbHtml(html, `#${LIGHTGG_COMMUNITY_AVG_ELEMID}`) : false
    }


    /**
     * Retrieves community average usage data for a certain item on Light.gg
     * @param {any} itemId 
     * @returns {ObjectArray} Community roll data objects array
     */
    static async GetExtraInfo(itemId) {
        const cacheKey = `${LIGHTGG_HTML_CACHEKEY_ROOT}-${itemId}`

        const fetchData = async () => {
            return await this.#GetHtmlItemDbData({itemId})
        }

        let html = await CacheManager.fetchAny(cacheKey, fetchData, LIGHTGG_CACHELIFE)

        return html ? LightGgDataParser.ProcessExtraInfoItemDbHtml(html, `#${LIGHTGG_SOCKETS_ELEMID}`) : false
    }

    /**
     * Opens a window to light.gg and gets the html body, or the specified element
     * @param itemId Id of the item to load.
     * @param elementId element id to retrieve
     * @param anchorId anchor id to attach to the link so that the window autoscroll there
     * @returns {string} Html data
     */
    static async #GetHtmlItemDbData({itemId, elementId, anchorId}) {
        if(!itemId) return

        let args = {url: `${LIGHTGG_ITEMDB_URL}${itemId}#${anchorId || ''}`}
        
        if(elementId) {
            let getHtmlFunction = () => {
                let elem = document.getElementById('__element_id__')
                return (elem && elem.innerHTML) ? elem.innerHTML : null
            }

            args = {...args,
                executeFunctionString: getHtmlFunction.toString().replace('__element_id__', elementId)
            }
        }

        let openWindowResponse = await BackgroundService.OpenWindowAndExecute(args)

        //TODO: could use a try catch , a log and store the result for later use so we dont call the background each time

        //BackgroundService.CloseWindow()

        return openWindowResponse
    }
}
