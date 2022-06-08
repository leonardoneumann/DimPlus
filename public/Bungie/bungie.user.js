/** @module Bungie */

class BungieUser {

    /** @type {BungieApi} */
    api

    constructor() {
        this.api = new BungieApi()
    }

    async getCurrentUser() {
        return await this.api.getCurrentUserProfile()
    }

    async getItemByInstanceId(itemInstanceId) {
        let res = await this.api.getItem(await this.getCurrentUser(), itemInstanceId)
        return res.item.data
    }

    async getAllMyItemsAndPerkRolls(itemHash) {
        const cacheKey = `/all-my-items`
        let cachedData = await CacheManager.readDataFromCache(cacheKey)
        let inv

        if(cachedData && cachedData.length) {
            inv = cachedData
        } else {
            inv = await this.api.getInventoryAndEquipment(await this.getCurrentUser())

            if(inv) {
                await CacheManager.saveDataToCache(cacheKey, inv, 3)
            }
        }

        let myItems = [...inv.profileInventory.data.items,
            ...Object.values(inv.characterEquipment.data).map(subInventory => subInventory.items).flat(),
            ...Object.values(inv.characterInventories.data).map(subInventory => subInventory.items).flat()
        ]

        let foundItems = myItems.filter(it => it.itemHash === itemHash)

        //TODO: Simplify - this is too much nested maps to convert data just to avoid refactoring CommunityRolls.AppendToCompare
        return foundItems.map(it => {

            let rolls = Object.values(inv.itemComponents.reusablePlugs.data[it.itemInstanceId].plugs).map( (rollCol, colIndex) => {
                    return rollCol.map((rollRow, rowIndex) => {
                    return {
                        id: rollRow.plugItemHash,
                        column: colIndex,
                        row: rowIndex
                    }
                })
            })

            return { uuid: it.itemInstanceId, rolls: rolls.flat() }
        })
    }
}