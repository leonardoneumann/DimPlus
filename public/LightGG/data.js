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
     * @param {string} html Html string for the 'community-rolls' div element
     * @returns {Array} Object array with roll data, including relative usage percentage and color, column position, img url, name
     */
    static ProcessCommunityAvgRollsItemDbHtml(html) {

        if (html != null && html.length) {
            let rollsHtml = $.parseHTML(html)

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


    /**
     * Parses the html data for the current logged users items
     * @param {string} html Html string for the 'community-rolls' div element
     * @returns {Array} Object array with items and roll data
     */
    static ProcessMyRollsItemDbHtml(html) {

        if (html != null && html.length) {
            let rollsHtml = $.parseHTML(html)

            let rollData = []

            $(rollsHtml).filter('.clearfix').each((rowIndex, rowElem) => {
                //let itemUUID = $(rowElem).find(".roll-header > .sharer > a[href^='/god-roll/roll-appraiser/#']")[0].href.split('#')[1]
                let itemUUID = $(rowElem).attr('id').split('-')[1]

                if(itemUUID) {
                    rollData.length++
                    rollData[itemUUID] = { uuid: itemUUID, rolls: [] }

                    //let rolls = $(rowElem).find(".pref a[href^='/db/items/']")

                    $(rowElem).find('.sockets > ul').each((colIndex, colElem) => {
                        //perks
                        if (colIndex < 4) {
                            $(colElem).children('li').each((perkColIndex, perkElem) => {
                                
                                let pref = $(perkElem).attr("class")
                                let perkId = $($(perkElem).children("a")[0]).attr("data-id")

                                rollData[itemUUID].rolls.push({id: perkId, pref: pref, column: colIndex+1})
                            })
                        } else {
                            //mod and masterwork
                        }
                    })
                }
            })

            return rollData
        } else {
            console.log("Error getting All items and Rolls from LightGG")
        }
    }

}
