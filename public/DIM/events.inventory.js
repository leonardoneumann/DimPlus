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
    var link;
  
    document.getElementById('app').addEventListener('click', event => {

        //let isOrganizer = document.location.href.indexOf('organizer') > 0

        let isOpeningSheet = $(event.target).parents(".item-popup").length;

        if(!isOpeningSheet) {
            let itemPopup = $(document.body).find('.item-popup').get(0)

            if(itemPopup && $(itemPopup).children().find(event.target).length) {
                //avoiding clicks from inside the popup
                return
            } else {
                let openSheetLink = $(itemPopup).find('a')[0]
                //try to get data opening the sheet page
                if(openSheetLink) {
                    openSheetLink.click()
                    return
                }
            }              
        } 
        else if (isOpeningSheet && !event.isTrusted) { //if its our simulated click
            try {
                let itemId = $(document.body).find(".sheet-contents a[href^='https://www.light.gg/']")[0].href.split('/')[6]

                let closeSheet = $(document.body).find('.sheet-close')[0]
                if(closeSheet)
                    closeSheet.click()

                if(itemId)
                    get_community_rolls(itemId)

            } catch (error) {
                console.log('Error getting itemId ' + error)
            }
        }
    })
}, {once: true})
