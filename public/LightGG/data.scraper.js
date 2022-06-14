/** @module LightGg */

const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'
const LIGHTGG_COMMUNITY_AVG_ELEMID = 'community-average'
const LIGHTGG_MYROLLS_ELEMID = 'my-rolls'
const LIGHTGG_SOCKETS_ELEMID = 'socket-container'

class LightGgDataScraper {

    /**
     * Retrieves community average usage data for a certain item on Light.gg
     * @param {any} itemId 
     * @returns {ObjectArray} Community roll data objects array
     */
    static async GetItemAvgRolls(itemId) {

        const cacheKey = `/lightgg-avg-roll-${itemId}`
        const fetchData = async () => {
            let html = await this.#GetHtmlItemDbData({itemId, elementId: LIGHTGG_COMMUNITY_AVG_ELEMID, anchorId: LIGHTGG_COMMUNITY_AVG_ELEMID})
            if(html) {
                let rollData = LightGgDataParser.ProcessCommunityAvgRollsItemDbHtml(html)
                if(rollData)
                    return rollData
            }
            return false
        }

        return await CacheManager.fetchAny(cacheKey, fetchData)
    }


    /**
     * Retrieves community average usage data for a certain item on Light.gg
     * @param {any} itemId 
     * @returns {ObjectArray} Community roll data objects array
     */
    static async GetExtraInfo(itemId) {

        const cacheKey = `/lightgg-extra-info-${itemId}`

        const fetchData = async () => {
            let html = await this.#GetHtmlItemDbData({itemId, elementId: LIGHTGG_SOCKETS_ELEMID })
            if(html) {
                let data = LightGgDataParser.ProcessExtraInfoItemDbHtml(html)
                if(data)
                    return data
            }
            return false
        }

        return await CacheManager.fetchAny(cacheKey, fetchData)

    }
    
    /**
     * @deprecated use the API now
     * @param {any} itemId 
     * @returns {Array} Community roll data objects array
     */
    static async GetAllMyRolls(itemId) {

        let ItemDbHtml = await this.#GetHtmlItemDbData({itemId, elementId: LIGHTGG_MYROLLS_ELEMID, anchorId: LIGHTGG_MYROLLS_ELEMID})

        if(ItemDbHtml) {
            let rollData = LightGgDataParser.ProcessMyRollsItemDbHtml(ItemDbHtml)
            if(rollData) {
                CacheManager.saveDataToCache(cacheKey, rollData)
            }
            return rollData
        }
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

        return openWindowResponse
    }
}
