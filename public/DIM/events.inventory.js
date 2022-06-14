/** @module DIM */

class DimInventoryEvents {

    lastClickedItemHash = null;

    /** @type BungieUser */
    currentUser

    /**
     * Hooks into clicks to item tiles
     * @param {MouseEvent} event 
     */
    async onItemClick(event) {

        if(!this.currentUser) {
            this.currentUser = new BungieUser()
        }

        let isItempopupClick = $(event.target).parents(".item-popup").length;

        if(!isItempopupClick) {
            let itemEl = $(event.target).children().parentsUntil(".item-drag-container")

            if(itemEl?.length === 1) {
                let itemId = itemEl[0].id
    
                if(itemId) {
                    let item = await this.currentUser.getItemByIID(itemId)
                    this.lastClickedItemHash = item.itemHash

                    try {
                        let lightGgItemAvgRolls = await LightGgDataScraper.GetItemAvgRolls(this.lastClickedItemHash)
                        let myItemRolls = await this.currentUser.getItemRollsForIID(itemId)
                        myItemRolls = myItemRolls.flat()
                        CommunityRolls.AppendToItemPopup(lightGgItemAvgRolls, myItemRolls)

                        let exinf = await LightGgDataScraper.GetExtraInfo(this.lastClickedItemHash)
                        CommunityRolls.AppendExtraInfoToItemPopup(exinf, myItemRolls)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

        } else {
            //Compare button click

            let isCompareButton;
            const scaleClassName = '.fa-balance-scale-left'
            if(event.target instanceof HTMLDivElement) {
                isCompareButton = $(event.target).children(scaleClassName).length > 0
            } else {
                isCompareButton = $(event.target).parent().children(scaleClassName).length > 0
            }
            
            if(isCompareButton && this.lastClickedItemHash) {
                let avgData = await LightGgDataScraper.GetItemAvgRolls(this.lastClickedItemHash)

                let myItemRolls = await this.currentUser.getAllMyItemsPerkRolls(this.lastClickedItemHash)

                if(myItemRolls.length > 0 && avgData.length > 0) {

                    CommunityRolls.AppendToCompare(myItemRolls.flat(), avgData)

                }
            }

        }

    }


}

