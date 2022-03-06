
function setDIMObservers() {
  let inventory_observer = new MutationObserver((_, quit) => {
      if (document.getElementsByClassName('item')[0]) {
          window.dispatchEvent(new Event('inventory_ready'))
          quit.disconnect()
      }
  })
  inventory_observer.observe(document, {
      childList: true,
      subtree: true
  })
}


window.addEventListener('inventory_ready', () => {

    var lastItemId;

    document.getElementById('app').addEventListener('click', async (event) => {
        //let isOrganizer = document.location.href.indexOf('organizer') > 0

        let isItempopupClick = $(event.target).parents(".item-popup").length;

        if(!isItempopupClick) {
            let itemPopup = $(document.body).find('.item-popup').get(0)

            if(itemPopup && $(itemPopup).children().find(event.target).length > 0) {
                
                //avoiding clicks from inside the popup
                return
            } else {
                if (itemPopup) {
                    let openSheetLink = $(itemPopup).find('a')[0]
                    //try to get data opening the sheet page with a fake click
                    if(openSheetLink) {
                        lastItemId = null
                        openSheetLink.click()
                        return
                    }
                }
            }              
        } else if (isItempopupClick && !event.isTrusted) { //if its our simulated click
            try {
                let itemId = $(document.body).find(".sheet-contents a[href^='https://www.light.gg/']")[0].href.split('/')[6]

                let closeSheet = $(document.body).find('.sheet-close')[0]

                if(closeSheet)
                    closeSheet.click()

                if(itemId) {
                    lastItemId = itemId
                    CommunityRolls.GetItemAvgRollsFromLightGg(itemId).then(rollsData => {
                        CommunityRolls.AppendToItemPopup(rollsData)
                    })
                } else {
                    lastItemId = null
                }
            
            } catch (error) {
                console.log('Error getting itemId ' + error)
            }
        }  else if (isItempopupClick && event.isTrusted) {
            
            //Compare button click
            let isCompareButton;
            const scaleClassName = '.fa-balance-scale-left'
            if(event.target instanceof HTMLDivElement) {
                isCompareButton = $(event.target).children(scaleClassName).length > 0
            } else {
                isCompareButton = $(event.target).parent().children(scaleClassName).length > 0
            }
            
            if(isCompareButton && lastItemId) {
                let myItemRolls = await CommunityRolls.GetAllMyRollsFromLightGg(lastItemId)
                let avgData = await CommunityRolls.GetItemAvgRollsFromLightGg(lastItemId)

                if(myItemRolls.length > 0 && avgData.length > 0) {

                    CommunityRolls.AppendToCompare(myItemRolls, avgData)

                }
            }
        }

    })
}, {once: true})
