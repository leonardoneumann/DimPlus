/** @module CommunityRolls */


class CommunityRolls {

    /**
     * Retrieves community average usage data for a certain item on Light.gg
     * @param {any} itemId 
     * @returns {Array} Community roll data objects array
     */
    static async GetItemAvgRollsFromLightGg(itemId) {
        const elementId = 'community-average'
        
        let ItemDbHtml = await LightGgData.GetHtmlItemDbData({itemId, elementId, anchorId: elementId})

        if(ItemDbHtml) {
            let rollData = LightGgData.ProcessCommunityAvgRollsItemDbHtml(ItemDbHtml)
            return rollData
        }
    }

    /**
     * Retrieves all rolls and items of a single itemid from Light.gg
     * @param {any} itemId 
     * @returns {Array} Community roll data objects array
     */
    static async GetAllMyRollsFromLightGg(itemId) {
        const elementId = 'my-rolls'
        
        let ItemDbHtml = await LightGgData.GetHtmlItemDbData({itemId, elementId})

        if(ItemDbHtml) {
            let rollData = LightGgData.ProcessMyRollsItemDbHtml(ItemDbHtml)
            return rollData
        }
    }

    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} rollsData 
     */
    static AppendToItemPopup(rollsData) {
        
        if(!rollsData) return
        
        const perkGrid = $(document.body).find(".item-popup .item-details-body .sockets").children()[1]
    
        if(perkGrid) {
            $(perkGrid).find("img[src^='https://www.bungie.net/']").each((index, imgElem) => {
    
                let parentDiv = $(imgElem).parent().parent().parent()
                let roll
                let guessed = false
    
                if(parentDiv)
                {
                    let childs = $(parentDiv).children()
                    if(childs && childs.length > 1) {
                        let curPerkName = childs[1].innerText
                        roll = rollsData.find(r => r.imgUrl === imgElem.src && r.name === curPerkName)
                    }
    
                    //we'll just guess here, where we dont have the perkname on the item-popup
                    // or if the language differs from light.gg and DIM
                    if(!roll) {
                        
                        let rolls = rollsData.filter(r => r.imgUrl === imgElem.src)
    
                        if (rolls.length > 1) {
                            //this case needs a fix , same icon for different perks is a problem without having the exact item uid
                            //or the perk name
                            roll = rolls[0]
                            guessed = true
                        } else if (rolls.length === 1) {
                            roll = rolls[0]
                        }
                    }
                        
                }
    
                $(parentDiv).append(guessed ? this.#createRollPercentPlaceElement({guessed: guessed}) 
                                            : this.#createRollPercentPlaceElement(roll))
            })
        }
    }


    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} rollsData 
     */
    static AppendToCompare(myItemRolls, avgRolls) {
        
        if(!avgRolls) return

        
        const compareGridItems = $(document.body).find(".sheet-container .item")
    
        if(compareGridItems) {
            $(compareGridItems).each((itemIndex, itemElem) => {

                let curItemUUID = $(itemElem).attr('class')

                let itemStatsElem = $(itemElem).parentsUntil('.compare-item')[0]

                if(itemStatsElem) {
                    $(itemElem).find("img[src^='https://www.bungie.net/']").each((imgIndex, imgElem) => {
                        let rollColDiv = $(imgElem).parentsUntil('.item-sockets')[0]

                        if (rollColDiv) {
                            
                            let curItemRolls = myItemRolls.find(r => r.uuid === curItemUUID)
                            console.log(curItemRolls)
                        }
                    })
                }
            })
        }
    }

    /**
     * Creates the div element to append to DIM
     * @param {string} place
     * @param {string} color
     * @param {string} percent
     * @param {string} guessed if the roll information is not exact
     * @returns {string} div element html
     */
    static #createRollPercentPlaceElement({place, color, percent, guessed}) {
        
        let elem = `
            <div class="relative-percent-container">
                <div class="relative-percent-place">
                    #${place ?? '??'}${guessed && place ? '?' : ''}
                </div>
                <div class="relative-percent-bar"
                    style="${ color ? 'background-color:' + color.replace('rgb','rgba').replace(')',', 0.80)') + ';border: 1px solid ' + color
                                    : 'background-color: rgba(211, 211, 211, 0.80); border: 1px solid rgb(211, 211, 211)' };">
                    ${percent ?? '???'}
                </div>
            </div>
        `

        return elem
    }

}





