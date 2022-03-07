/** @module DIM */

const DIM_EVENT_INVENTORY_READY = 'dim_inventory_ready'

const Inventory = new DimInventory();

class DimEvents {

    /**
     * Initializes event listeners , called from the main entrypoint
     */
    Initialize() {
        this.SetInventoryReadyListener(() =>{
            document.getElementById('app').addEventListener('click', Inventory.onInventoryItemClick)
        })
    }

    /**
     * Sets a callback to be called when inventory is available
     * @param {Function} callback 
     */
    SetInventoryReadyListener(callback) {
        this.#SetDocumentObserver((_, quit) => {
            if (document.getElementsByClassName('item')[0]) {
                window.dispatchEvent(new Event(DIM_EVENT_INVENTORY_READY))
                quit.disconnect()
            }
        })

        window.addEventListener(DIM_EVENT_INVENTORY_READY, callback, {once: true})
    }

    /**
     * Sets an observer on the main document
     * @param {Function} mutationCallback
     */
    #SetDocumentObserver(mutationCallback) {
        let observer = new MutationObserver(mutationCallback)
        observer.observe(document, {
            childList: true,
            subtree: true
        })
    }
}



