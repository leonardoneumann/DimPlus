/** @module DIM */


class CommunityRolls {

    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} rollsData 
     */
    static AppendToItemPopup(rollsData) {
        
        if(!rollsData) return
        
        const perkGrid = $(document.body).find(".item-popup .item-details-body .sockets").children()[1]
    
        if(perkGrid) {
            $(perkGrid).find("image[href^='https://www.bungie.net/']").each((index, imgElem) => {
    
                let parentDiv = $(imgElem).parent().parent().parent() //up three levels
                let roll
                let guessed = false
    
                if(parentDiv)
                {
                    let childs = $(parentDiv).parent().children()
                    if(childs && childs.length > 1) {
                        let curPerkName = childs[1].innerText //Perk Name
                        roll = rollsData.find(r => r.imgUrl === imgElem.href.baseVal && r.name === curPerkName)
                    }
    
                    //we'll just guess here, where we dont have the perkname on the item-popup
                    // or if the language differs from light.gg and DIM
                    if(!roll) {
                        
                        let rolls = rollsData.filter(r => r.imgUrl === imgElem.href.baseVal)
    
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

                if(roll || guessed)
                    $(parentDiv).append(guessed ? this.#createRollPercentPlaceElement({guessed: guessed}) 
                                                : this.#createRollPercentPlaceElement(roll))
            })
        }
    }


    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} myItemRolls
     * @param {ObjectArray} avgRolls
     */
    static AppendToCompare(myItemRolls, avgRolls) {
        
        if(!avgRolls) return
        
        const compareGridItems = $(document.body).find(".sheet-container .item")
    
        if(compareGridItems) {
            $(compareGridItems).each((itemIndex, itemElem) => {

                let curItemUUID = $(itemElem).attr('id')

                //thankful for light.gg descriptive html 
                let columns = $(itemElem).parentsUntil('.compare-item').parent().find('div.item-socket:not(.hasMenu)')

                if(columns.length > 0) {

                    $(columns).each((colIndex, colElem) => {
                        
                        if(colIndex === 0) return //Frame Type
                        
                        $(colElem).find('.socket-container.notIntrinsic').each((rowIndex, rollElem) => {
                            //console.log(`curItemUUID : ${curItemUUID} colIndex : ${colIndex} rowIndex : ${rowIndex}`)
                            let curRoll = myItemRolls.find(r => r.uuid === curItemUUID)
                                               .rolls.find(r => r.column === colIndex - 1 && r.row === rowIndex)

                            if(curRoll){
                                let curRollStats = avgRolls.find(p => p.perkId === curRoll.id)

                                if(curRollStats) {
                                    $(rollElem).append(this.#createRollPercentPlaceElement(curRollStats))
                                }
                            }
                        })
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
            <div class="avg-percent-container">
                <div class="avg-percent-place">
                    #${place ?? '??'}${guessed && place ? '?' : ''}
                </div>
                <div class="avg-percent-bar"
                    style="${ color ? 'background-color:' + color.replace('rgb','rgba').replace(')',', 0.80)') + ';border: 1px solid ' + color
                                    : 'background-color: rgba(211, 211, 211, 0.80); border: 1px solid rgb(211, 211, 211)' };">
                    ${percent ?? '???'}
                </div>
            </div>
        `

        return elem
    }

}





