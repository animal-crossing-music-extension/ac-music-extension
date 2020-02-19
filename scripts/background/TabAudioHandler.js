// Handles tabs playing audio

'use strict';

function TabAudioHandler() {

    let tabUpdatedHandler;
    let checkTabsInterval;
    let callback;

    this.audible = false;
    this.activated = false;

    this.registerCallback = function (cb) {
        callback = cb;
    }

    this.activate = async function () {
        printDebug("Activating TabAudioHandler.");

        this.activated = true;

        if (tabUpdatedHandler) removeHandler();
        tabUpdatedHandler = this.checkTabs;
        chrome.tabs.onUpdated.addListener(tabUpdatedHandler);
        chrome.tabs.onRemoved.addListener(tabUpdatedHandler); // A tab that is audible can be closed and will not trigger the updated event.
        checkTabsInterval = setInterval(this.checkTabs, 100);
        this.checkTabs();
    }

    function removeHandler() {
        if (tabUpdatedHandler) {
            chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
            chrome.tabs.onRemoved.removeListener(tabUpdatedHandler);
        }
        if (checkTabsInterval) clearInterval(checkTabsInterval);
        tabUpdatedHandler = null;
    }

    // Done this way so the correct "this" can still be accessed
    this.checkTabs = (force = false) => {
        // A tab can be muted and still be "audible"
        chrome.tabs.query({
            muted: false,
            audible: true
        }, tabs => {
            let nowAudible = tabs.length > 0;
            // If forced, then we send the callback regardless if there's been no change to catch up on any missed events.
            if (nowAudible != this.audible || force) {
                callback(tabs.length > 0);
                this.audible = nowAudible;
            }
        });
    }
}
