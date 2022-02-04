/* eslint-disable no-undef */
function get_community_rolls(itemId) {

    if(!itemId) return

    let link = 'https://www.light.gg/db/items/' + itemId + '#community-average'
    console.log('Item popup pressed , light.gg link : ' + link)
    
    // eslint-disable-next-line no-restricted-globals
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
                                    roll = rollData.find(r => r.imgUrl === imgElem.src && r.name === curPerkName)
                                }

                                //we'll just guess here, where we dont have the perkname on the item-popup
                                // or if the language differs from light.gg and DIM
                                if(!roll) {
                                    
                                    let rolls = rollData.filter(r => r.imgUrl === imgElem.src)

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

                            if(roll){
                                if (!guessed) {
                                    $(parentDiv).append(`
                                    <div class="relative-percent-container">
                                        <div class="relative-percent-place">#${roll.place}${guessed ? '??' : ''}</div>
                                        <div class="relative-percent-bar"
                                             style="background-color: ${roll.color.replace('rgb','rgba').replace(')',', 0.80)')}; border: 1px solid ${roll.color};" >
                                            ${roll.percent}
                                        </div>
                                    </div>
                                    `)
                                } else {
                                    $(parentDiv).append(`
                                    <div class="relative-percent-container">
                                        <div class="relative-percent-place">#??</div>
                                        <div class="relative-percent-bar"
                                             style="background-color: rgba(211, 211, 211, 0.80); border: 1px solid rgb(211, 211, 211);" >
                                            ???
                                        </div>
                                    </div>
                                    `)
                                }
                            }
                        })
                    }
                }
            )
        }
    );
}