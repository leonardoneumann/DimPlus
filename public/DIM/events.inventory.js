/** @module DIM */

class DimInventoryEvents {

    lastClickedItemHash = null;

    /**
     * Hooks into clicks to item tiles
     * @param {MouseEvent} event 
     */
    async onItemClick(event) {

        let isItempopupClick = $(event.target).parents(".item-popup").length;

        if(!isItempopupClick) {
            let itemEl = $(event.target).children().parentsUntil(".item-drag-container")

            if(itemEl?.length === 1) {
                let itemId = itemEl[0].id
    
                if(itemId) {
                    let api = new BungieApi()
                    let user = await api.getCurrentUserProfile()
                    let res = await api.getItem(user, itemId)

                    this.lastClickedItemHash = res.item.data.itemHash
    
                    LightGgDataScraper.GetItemAvgRolls(this.lastClickedItemHash).then(rollsData => {
                        CommunityRolls.AppendToItemPopup(rollsData)
                    })
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
                let myItemRolls = await LightGgDataScraper.GetAllMyRolls(this.lastClickedItemHash)

                if(myItemRolls.length > 0 && avgData.length > 0) {

                    CommunityRolls.AppendToCompare(myItemRolls, avgData)

                }
            }

        }

    }


}

