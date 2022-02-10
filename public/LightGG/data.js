/** @module LightGg */

const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'

class LightGgData {

    /**
     * Opens a window to light.gg and gets the html body, or the specified element
     * @param {int} itemId Id of the item to load.
     * @param {string} [elementId] element id to retrieve
     * @param {string} [anchorId] anchor id to attach to the link so that the window autoscroll there
     * @returns {string} Html data
     */
    static async GetHtmlItemDbData({itemId, elementId, anchorId}) {
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

    /**
     * Parses the html data for community average rolls
     * @param {string} htmlItemData Html string for the 'community-rolls' div element
     * @returns {Array} Object array with roll data, including relative usage percentage and color, column position, img url, name
     */
    static async ProcessCommunityAvgRollsItemDbHtml(htmlItemData) {

        if (htmlItemData != null && htmlItemData.length) {
            let rollsHtml = $.parseHTML(htmlItemData)

            let rollData = []
            let rollIndex = 0
            let column = 0
            $(rollsHtml).each((colIndex, elem) => {

                if(elem instanceof HTMLUListElement){
                    column++;
                } else {
                    return
                }

                $(elem).children('li').each((rowIndex, liElem) => {

                    rollData[rollIndex] = {}

                    $(liElem).children().each((i, perkDetails) => {
                    
                        // eslint-disable-next-line default-case
                        switch(perkDetails.className) {
                            case 'percent':
                                rollData[rollIndex] = {...{
                                    percent: perkDetails.innerText,
                                    column: column,
                                    place: rowIndex + 1
                                }}
                                break;

                            case 'relative-percent-container':
                                rollData[rollIndex].color = perkDetails.children[0].style.backgroundColor
                                break;

                            case 'item show-hover':
                                rollData[rollIndex].perkId = perkDetails.getAttribute('data-id')
                                let imgEl = $(perkDetails).find('img')[0]

                                rollData[rollIndex].imgUrl = imgEl.src
                                rollData[rollIndex].name = imgEl.alt
                        }

                    })

                    rollIndex++
                })
            })

            return rollData
        } else {
            console.log("Error getting Community Avg Data from LightGG")
        }
    }

}
