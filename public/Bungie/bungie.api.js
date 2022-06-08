/** @module Bungie */

const BUNGIE_API_BASEURL = 'https://www.bungie.net/Platform/'
const BUNGIE_API_KEY = () => atob(atob('TldWak1ERmpZV1kyWVdWbE5EVXdaRGxrWVdKbE5qUTJNamswWm1aa1l6az0='))

class BungieApi {

    /** @type {Object} DIM 'authorization' object from localstorage */
    authorizationInfo

    constructor() {
        this.#loadConfig()
    }

    #getFromLocalStorage(key) {
        let val = localStorage.getItem(key)
        if(val && val.length) {
            return JSON.parse(val)
        }
    }

    #loadConfig() {
        this.authorizationInfo = this.#getFromLocalStorage('authorization')
    }



    async execRequest(request, useCache = false) {
        let requestInfo = {
            method: request.method,
            mode: 'cors',
            headers: {
                'X-API-Key': BUNGIE_API_KEY(),
                'Content-Type': request.contentType || 'application/x-www-form-urlencoded'
            }
        }

        if(request.useAuth) {
            requestInfo.headers.authorization = `Bearer ${this.authorizationInfo.accessToken.value}`
        }

        try {    
            if(useCache) {
                let response = await CacheManager.fetch(new Request(`${BUNGIE_API_BASEURL}${request.url}` , requestInfo))

                return response?.ErrorStatus === "Success" ? response : null
            } else { 
                //Add error handling
                let response = await fetch(`${BUNGIE_API_BASEURL}${request.url}` , requestInfo)

                return response.ok ? response.json() : null
            }
        }
        catch(err) {
            throw `BungieApi.Request(): Error fetching from ${request.url} : ${err.message}`
        }
    }

    async getUserProfiles() {
        let request = {
            url: `Destiny2/254/Profile/${this.authorizationInfo.bungieMembershipId}/LinkedProfiles/?getAllMemberships=true`,
            method: 'GET',
            useAuth: true
        }

        let res = await this.execRequest(request)

        return res?.Response.profiles
    }

    /**
     * Gets Item
     * @param id membershipId
     * @param platform membershipType
     * @param {int} itemInstanceId Item UUID
     * @returns {Object} User Manifest data
     */
    async getItem({id, platform}, itemInstanceId) {
        let components = [
            DestinyComponentType.ItemInstances,
            DestinyComponentType.ItemObjectives,
            DestinyComponentType.ItemSockets,
            DestinyComponentType.ItemTalentGrids,
            DestinyComponentType.ItemCommonData,
            DestinyComponentType.ItemPlugStates,
            DestinyComponentType.ItemReusablePlugs,
            DestinyComponentType.ItemPlugObjectives,
        ]

        let request = {
            
            url: `Destiny2/${platform}/Profile/${id}/Item/${itemInstanceId}/?components=${components.join(',')}`,
            method: 'GET',
            useAuth: true
        }

        let res = await this.execRequest(request, true)

        return res?.Response
    }

    /**
     * Gets user Inventory
     * @param id membershipId
     * @param platform membershipType
     * @returns {Object} User Manifest data
     */
    async getInventoryAndEquipment({id, platform}) {
        let components = [
            DestinyComponentType.ProfileInventories,
            DestinyComponentType.CharacterInventories,
            DestinyComponentType.CharacterEquipment,
            DestinyComponentType.ItemStats,
            DestinyComponentType.ItemSockets,
            DestinyComponentType.ItemReusablePlugs
        ]

        let res = await this.getUserProfileComponents({id, platform, components})

        return res
    }

    /**
     * Gets user information (inventory, etc)
     * @param id membershipId
     * @param platform membershipType
     * @param {Array<DestinyComponentType>} components
     * @param {Boolean} cache use cache
     * @returns {Object} User Manifest data
     */
    async getUserProfileComponents({id, platform, components, cache}) {
        let request = {
            url: `Destiny2/${platform}/Profile/${id}/?components=${components.join(',')}`,
            method: 'GET',
            useAuth: true
        }

        let res = await this.execRequest(request, cache)

        return res?.Response
    }

    async getCurrentUserProfile() {
        let profiles

        try {
            profiles = await this.getUserProfiles()
        }
        catch(err) {
            console.log(err);
        }

        if(profiles?.length > 0) {
            return {
                'id': profiles[0].membershipId,
                'platform': profiles[0].membershipType
            }
        } else {
            return null
        }
    }
}