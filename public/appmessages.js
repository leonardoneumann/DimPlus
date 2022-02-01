// Internal Messaging to the React App
window.addEventListener("message", function(event) {
    if (event.source !== window) return;
    onDidReceiveMessage(event);
  });
  
async function onDidReceiveMessage(event) {
  if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
    window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
  }
}