/** @module LightGg */

class LightGgDataParser {

    /**
     * Parses the html data for community average rolls
     * @param {string} html Html string for the 'community-rolls' div element
     * @returns {Array} Object array with roll data, including relative usage percentage and color, column position, img url, name
     */
    static ProcessCommunityAvgRollsItemDbHtml(html, locator) {

        if (html != null && html.length) {
            let rollsHtml = $(html).find(locator).first()

            let rollData = []
            let rollIndex = 0
            let column = 0
            $(rollsHtml).children().each((colIndex, elem) => {

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
    static ProcessMyRollsItemDbHtml(html, locator) {

        if (html != null && html.length) {
            let rollsHtml = $.parseHTML(html)

            let rollData = []
            let rollDataIndex = 0

            $(rollsHtml).children('.clearfix.roll').each((rowIndex, rowElem) => {
                //let itemUUID = $(rowElem).find(".roll-header > .sharer > a[href^='/god-roll/roll-appraiser/#']")[0].href.split('#')[1]
                let itemUUID = $(rowElem).attr('id').split('-')[1]

                if(itemUUID) {
                    
                    rollData.push({ uuid: itemUUID, rolls: [] })

                    //let rolls = $(rowElem).find(".pref a[href^='/db/items/']")

                    $(rowElem).find('.sockets > ul').each((colIndex, colElem) => {
                        //perks
                        if (colIndex < 4) {
                            $(colElem).children('li').each((perkRowIndex, perkElem) => {
                                
                                let pref = $(perkElem).attr("class")
                                let perkId = $($(perkElem).children("a")[0]).attr("data-id")

                                rollData[rollDataIndex].rolls.push({id: perkId, pref: pref, column: colIndex, row: perkRowIndex})
                            })
                        } else {
                            //mod and masterwork
                        }
                    })

                    rollDataIndex++
                }
            })

            return rollData
        } else {
            console.log("Error getting All items and Rolls from LightGG")
        }
    }


    /**
     * 
     * @param {string} html Html string for the 'community-rolls' div element
     * @returns {Array} Object array with roll data, including relative usage percentage and color, column position, img url, name
     */
    static ProcessExtraInfoItemDbHtml(html, locator) {

        let nodes = $.parseHTML(html)

        nodes = $(nodes).find(locator)

        const parseSection = (htmlSection) => {
            let data = []
            $(htmlSection).children('div').each((groupIndex, groupElem) => { 

                let idsElems = $(groupElem).find('.item')
                let namesElems = $(groupElem).find('.perk-names div')
                let percentElem = $(groupElem).find('.combo-percent')[0]?.innerText.trim()
                let ids = []
                let imgs = []
                let names = []
    
                for (const elem of idsElems) {
                    ids.push(elem.dataset?.id)
                    imgs.push($(elem).find('img')[0]?.src)
                }
    
                for (const elem of namesElems) {
                    names.push(elem?.innerText.replace('+', '').trim())
                }
    
                data.push({
                    ids: ids,
                    imgs: imgs,
                    names:  names,
                    percentText: percentElem
                })
            })

            return data
        }

        let combos = parseSection($(nodes).find('#trait-combos')[0])
        let masterwork = parseSection($(nodes).find('#masterwork-stats')[0])
        let mod = parseSection($(nodes).find('#mod-stats')[0])

        return {
            combos: combos,
            masterwork: masterwork,
            mod: mod
        }
    }

}
