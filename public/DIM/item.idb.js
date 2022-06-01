/** @module DIM */
/* global chrome */

class DimItemIDB {

    /** @type {Object} d2-manifest big json */
    manifest

    /** @type {BungieApi} */
    bungieApi

    constructor() {
        this.manifest = null
        this.bungieApi = new BungieApi()
    }

    async openIDB(name) {
        return new Promise((resolve, reject) => {
            let openrequest = window.indexedDB.open(name)

            openrequest.onerror = event => {
                console.log(`Error opening DIM DB for index ${index}, error code : ${event.target.errorCode}`)
                reject()
            }
            
            openrequest.onsuccess = event => {
                resolve(event.target.result)
            }
        })
    }

    async openManifest() {
        return new Promise(async (resolve, reject) => {
            let idb = await this.openIDB('keyval-store')
            let objectStore = idb.transaction(["keyval"], 'readonly').objectStore("keyval");
            let readreq = objectStore.get("d2-manifest")
            
            readreq.onerror = event => {
                reject(`Error reading DIM DB ${event.target.errorCode}`)
            }

            readreq.onsuccess = event => {
                let data = event.target.result
                resolve(data)
            }
        })
    }

    async openInventory() {
        
        if(this.manifest === null) {
            try {
                this.manifest = await this.openManifest()
            }
            catch(error) {
                console.log(error)
                return null
            }
        }

        if(this.manifest && this.manifest.DestinyInventoryItemDefinition){
            return this.manifest.DestinyInventoryItemDefinition
        }
    }
}
