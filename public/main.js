/* global chrome */

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    //bootstrapReactApp();
});

const dimEvents = new DimEvents()
dimEvents.Initialize()