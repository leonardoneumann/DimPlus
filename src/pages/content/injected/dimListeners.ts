import { DIM_EVENT_INVENTORY_READY } from '@src/shared/dim/globals';
import { onItemClick as onInventoryItemClick } from './dimInventory';

/**
 * Sets a callback to be called when inventory is available
 * @param {Function} callback
 */
function SetInventoryReadyListener(callback) {
  SetDocumentObserver((_, quit) => {
    if (document.getElementsByClassName('item')[0]) {
      window.dispatchEvent(new Event(DIM_EVENT_INVENTORY_READY));
      quit.disconnect();
    }
  });

  window.addEventListener(DIM_EVENT_INVENTORY_READY, callback, { once: true });
}

/**
 * Sets an observer on the main document
 * @param {Function} mutationCallback
 */
function SetDocumentObserver(mutationCallback) {
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

async function setDimListeners() {
  SetInventoryReadyListener(() => {
    document.getElementById('app').addEventListener('click', onInventoryItemClick);
  });
}

setDimListeners();
