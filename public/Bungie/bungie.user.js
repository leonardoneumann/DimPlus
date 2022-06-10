/** @module Bungie */

class BungieUser {

    /** @type {BungieApi} */
    api

    constructor() {
        this.api = new BungieApi()
    }

    /**
     * Returns current logged user
     *
     * @return {Object} 
     * @memberof BungieUser
     */
    async getCurrentUser() {
        return await this.api.getCurrentUserProfile()
    }

    /**
     * Gets Item information from current user for a given item instance id
     *
     * @param {*} itemInstanceId
     * @return {Object} Bungie Item object
     * @memberof BungieUser
     */
    async getItemByIID(itemInstanceId) {
        let res = await this.api.getItem(await this.getCurrentUser(), itemInstanceId)
        return res.item.data
    }

    /**
     *
     *
     * @param {*} itemInstanceId
     * @param {*} inventory
     * @return {*} 
     * @memberof BungieUser
     */
    async getItemRollsForIID(itemInstanceId, inventory) {
        inventory = inventory || await this.getInventory()

        //TODO: Simplify - this is too much nested maps to convert data just to avoid refactoring CommunityRolls.AppendToCompare
        return Object.values(inventory.itemComponents.reusablePlugs.data[itemInstanceId].plugs).map( (rollCol, colIndex) => {
            return rollCol.map((rollRow, rowIndex) => {
                return {
                    id: rollRow.plugItemHash,
                    column: colIndex,
                    row: rowIndex
                }
            })
        })
    }

    /**
     * Returns current user Inventory, Equipment and associated plug descriptors
     *
     * @return {Object} Inventory object
     * @memberof BungieUser
     */
    async getInventory() {
        const fetchData = async () => {
            return await this.api.getInventoryAndEquipment(await this.getCurrentUser())
        }
        return await CacheManager.fetchAny('/all-my-items', fetchData, 3)
    }

    /**
     *
     *
     * @return {Array} 
     * @memberof BungieUser
     */
    async getInventoryAllItems(inventory) {
        inventory = inventory || await this.getInventory()

        return [
            ...inventory.profileInventory.data.items,
            ...Object.values(inventory.characterEquipment.data).map(subInventory => subInventory.items).flat(),
            ...Object.values(inventory.characterInventories.data).map(subInventory => subInventory.items).flat()
        ]
    }

    /**
     * Gets all Item instances and its perks locations for a given Item on current user
     *
     * @param {BigInt} itemHash Item Hash/id
     * @return {Array} Array of items and their current rolls
     * @memberof BungieUser
     */
    async getAllMyItemsPerkRolls(itemHash) {
        let myItems = await this.getInventoryAllItems()

        let foundItems = myItems.filter(it => it.itemHash === itemHash)
        
        return foundItems.map(async it => {
            let rolls = await this.getItemRollsForIID(it.itemInstanceId)
            return { uuid: it.itemInstanceId, rolls: rolls.flat()}
        })
    }
}