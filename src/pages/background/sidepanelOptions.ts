import { DIM_URL_ORIGIN } from '../../dim/globals';

export function setSidepanelOptions() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

  chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    const url = new URL(tab.url);
    // Enables the side panel DIM site
    if (url.origin === DIM_URL_ORIGIN) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'src/pages/sidepanel/index.html',
        enabled: true,
      });
    } else {
      // Disables the side panel on all other sites
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false,
      });
    }
  });
}
