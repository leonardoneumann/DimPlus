/** @module DIM */


class CommunityRolls {

    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} rollsData 
     * @param {Object} itemRolls
     */
    static AppendToItemPopup(rollsData, itemRolls) {
        
        if(!rollsData || !itemRolls) return

        itemRolls = itemRolls.flat()
        
        const perkGrid = $(document.body).find(".item-popup .item-details-body .sockets").children()[1]
        let isGrid = $(perkGrid).find("button").children('.fa-list').length
        let isList = $(perkGrid).find("button").children('.fa-grid').length
    
        let rollContainers = []
        if(perkGrid) {
            $(perkGrid).find("image[href^='https://www.bungie.net/']").each((index, imgElem) => {
    
                rollContainers.push($(imgElem).parent().parent().parent()) //up three levels

            })

            if(rollContainers.length && isGrid) {
                rollContainers.forEach((rollElem, index) => {
                    let roll = rollsData.find(r => r.perkId == itemRolls[index].id)

                    if(roll)
                        $(rollElem).append(this.#createRollPercentPlaceElement(roll))
                })
            }
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
                                let curRollStats = avgRolls.find(p => p.perkId === curRoll.id.toString())

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





