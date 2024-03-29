/** @module DIM */


class CommunityRolls {

    /**
     * Processes roll data and appends it to the DIM popup window
     * @param {ObjectArray} rollsData 
     * @param {Object} itemRolls
     */
    static AppendToItemPopup(rollsData, itemRolls) {

        if (!rollsData || !itemRolls) return

        itemRolls = itemRolls.flat()
        let perkGrid, isGrid, isList

        try {
            perkGrid = $(document.body).find(".item-popup .item-details-body > div:eq(4) > div:eq(1)")
            isGrid = $(perkGrid).find("button").children('.fa-list').length
            isList = $(perkGrid).find("button").children('.fa-th').length
        } 
        catch(err) {
            console.error("[DIM+] AppendToItemPopup(): Perk Grid selector query is failing")
            throw(err)
        }
        
        let rollContainers = []
        if (perkGrid) {

            //gets all perk images
            $(perkGrid).find("image[href^='https://www.bungie.net/']").each((index, imgElem) => {
                rollContainers.push($(imgElem).parent().parent().parent()) //up three levels
            })

            // if perks are listed as grid , its pretty straightforward
            if (rollContainers.length && isGrid) {
                rollContainers.forEach((rollElem, index) => {
                    const roll = itemRolls[index]?.id ? rollsData.find(r => r.perkId == itemRolls[index].id) : false

                    if (roll)
                        $(rollElem).append(this.#createRollPercentPlaceElement(roll))
                })
            }

            //we'll just use the old method for lists until we do a re-paint of this whole section
            if (rollContainers.length && isList) {

                rollContainers.forEach((rollElem, index) => {

                    const imgUrl = $(rollElem).find("image")[0]?.href.baseVal //
                    const children = $(rollElem).parent().children()
                    const curPerkName = children[1]?.innerText //Perk Name

                    let guessed = false
                    let roll = rollsData.find(r => r.imgUrl === imgUrl && r.name === curPerkName)

                    if (!roll) {
                        const rolls = rollsData.filter(r => r.imgUrl === imgUrl)

                        if (rolls.length > 1) {
                            //this case needs a fix , same icon for different perks is a problem without having the exact item uid
                            //or the perk name
                            roll = rolls[0]
                            guessed = true
                        } else if (rolls.length === 1) {
                            roll = rolls[0]
                        }
                    }

                    if (roll || guessed)
                        $(rollElem).append(guessed ? this.#createRollPercentPlaceElement({
                                guessed: guessed
                            }) :
                            this.#createRollPercentPlaceElement(roll))

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

        if (!avgRolls) return

        const compareGridItems = $(document.body).find(".sheet-container .item")

        if (compareGridItems) {
            $(compareGridItems).each((itemIndex, itemElem) => {

                const curItemUUID = $(itemElem).attr('id')

                const columns = $(itemElem).parents().eq(3).find('.item-sockets').eq(0).children()

                if (columns.length > 0) {

                    $(columns).each((colIndex, colElem) => {

                        $(colElem).find('.plug').each((rowIndex, rollElem) => {
                            //console.log(`curItemUUID : ${curItemUUID} colIndex : ${colIndex} rowIndex : ${rowIndex}`)
                            const curRoll = myItemRolls.find(r => r.uuid === curItemUUID)
                                .rolls.find(r => r.column === colIndex && r.row === rowIndex)

                            if (curRoll) {
                                const curRollStats = avgRolls.find(p => p.perkId === curRoll.id.toString())

                                if (curRollStats) {
                                    $(rollElem).append(this.#createRollPercentPlaceElement(curRollStats))
                                }
                            }
                        })
                    })
                } else {
                    console.error("[DIM+] AppendToCompare(): Perk Grid selector query is failing")
                }
            })
        }
    }

    static ClearExtraInfoItemPopup() {
        const extraInfoContainer = $(document.body).find('#extra-info-container').first()

        if (extraInfoContainer.length) {
            extraInfoContainer.remove()
        }
    }

    /**
     * Appends extra information regarding trait combos, masterwork and mod popularity 
     * to the item popup
     * @static
     * @param {*} extraInfo
     * @param {*} itemRolls
     * @memberof CommunityRolls
     */
    static AppendExtraInfoToItemPopup(extraInfo, itemRolls) {

        let extraInfoContainer = $(document.body).find('.extra-info').first()
        const createContainer = !(extraInfoContainer.length)

        if (createContainer) {
            extraInfoContainer = $('<div class="extra-info">')
        } else {
            extraInfoContainer.empty()
        }

        $(extraInfoContainer).append('<span>Popular Trait Combos</span>')

        extraInfo.combos.forEach(info => {

            let foundRolls = 0

            itemRolls.forEach(r => {
                info.ids.forEach((id, index) => {
                    if (r.id == id) foundRolls++
                })
            })

            const hasCombo = foundRolls === info.ids.length

            extraInfoContainer.append(
                `<div ${hasCombo ? "class='has-combo'" : ''}>
                    <img src="${info.imgs[0]}"><img src="${info.imgs[1]}">
                    <div>
                        ${info.names[0]} + ${info.names[1]}<br />
                        ${info.percentText}
                    </div>
                </div>`
            )
        })

        const createSingleIconDescriptionDiv = (data) => {
            data.forEach(info => {
                extraInfoContainer.append(
                    `<div>
                        <img src="${info.imgs[0]}">
                        <div>
                            ${info.names[0]}<br />
                            ${info.percentText}
                        </div>
                    </div>`
                )
            })
        }

        if (extraInfo.masterwork.length) {
            $(extraInfoContainer).append('<span>Masterwork Popularity</span>')
            createSingleIconDescriptionDiv(extraInfo.masterwork)
        }

        if (extraInfo.mod.length) {
            $(extraInfoContainer).append('<span>Mod Popularity</span>')
            createSingleIconDescriptionDiv(extraInfo.mod)
        }

        if (createContainer) {
            const container = $(document.body).find('.item-popup').children().first().children().first()
            //pretty sure there is a better way to do this
            const popupContainer = $('<div>', {
                class: $(container).children().first().attr('class'),
                id: 'extra-info-container'
            })

            $(popupContainer).append(extraInfoContainer)
            $(container).prepend(popupContainer)
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
    static #createRollPercentPlaceElement({
        place,
        color,
        percent,
        guessed
    }) {

        const elem = `
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
