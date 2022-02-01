function get_community_rolls(itemId) {

    if(!itemId) return

    let link = 'https://www.light.gg/db/items/' + itemId + '#community-average'
    console.log('Item popup pressed , light.gg link : ' + link)
    
    let w = 350, h = 570, left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2)
    //let windowData = {url: link, type: 'popup', width: w, height: h, left: left, top: top, state: 'minimized'}s
    let windowData = {url: link, type: 'popup', state: 'minimized'}

    chrome.runtime.sendMessage({ open_window: windowData }, 
        async (openPopUpResponse) => {
            console.log("open_popup returned")
            console.log(openPopUpResponse)

            let getCommunityRollsFunction = () => {
                var communityDiv = document.getElementById('community-average')
                if(communityDiv){
                    return communityDiv.innerHTML
                } else { 
                    return null
                }
            }

            chrome.runtime.sendMessage({ execute: { tabId: openPopUpResponse.tabId, script: getCommunityRollsFunction.toString() } }, 
                async (communityRollsResponse) => {
                    console.log("get_community_rolls returned")

                    let rollsHtml = $($.parseHTML( communityRollsResponse.results[0] ) )

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
                            
                                switch(perkDetails.className) {
                                    case 'percent':
                                        rollData[rollIndex] = {...{
                                            percent: perkDetails.innerText,
                                            column: column,
                                            place : rowIndex + 1
                                        }}
                                        break;

                                    case 'relative-percent-container':
                                        rollData[rollIndex].color = perkDetails.children[0].style.backgroundColor
                                        break;

                                    case 'item show-hover':
                                        rollData[rollIndex].perkId = perkDetails.getAttribute('data-id')
                                        rollData[rollIndex].perkImgUrl = $(perkDetails).find('img')[0].src
                                        break;
                                }

                            })

                            rollIndex++
                        })
                    })

                    const perkGrid = $(document.body).find(".item-popup .item-details-body .sockets").children()[1]

                    if(perkGrid) {
                        $(perkGrid).find("img[src^='https://www.bungie.net/']").each((index, imgElem) => {

                            let roll = rollData.find(roll => roll.perkImgUrl == imgElem.src)
                            if(roll){
                                let parentDiv = $(imgElem).parent().parent().parent()

                                $(parentDiv).append(`
                                    <div class="relative-percent-container">
                                        <div class="relative-percent-place">#${roll.place}</div>
                                        <div class="relative-percent-bar"
                                             style="background-color: ${roll.color.replace('rgb','rgba').replace(')',', 0.80)')}; border: 1px solid ${roll.color};" >
                                            ${roll.percent}
                                        </div>
                                    </div>
                                `)

                                //parentDiv[0].style.borderColor = roll.color
                                //parentDiv[0].style.borderWidth = 'medium'
                                //$(parentDiv).siblings()[0].innerText += ` [ #${roll.place} - ${roll.percent} ]`
                            }

                        })
                    }
                }
            )
        }
    );
}