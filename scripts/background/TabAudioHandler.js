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
        tabUpdatedHandler = checkTabs;
        chrome.tabs.onUpdated.addListener(checkTabs);
        chrome.tabs.onRemoved.addListener(checkTabs); // A tab that is audible can be closed and will not trigger the updated event.
        checkTabsInterval = setInterval(checkTabs, 100);
        checkTabs();
    }

    function removeHandler() {
        if (tabUpdatedHandler) chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
        if (checkTabsInterval) clearInterval(checkTabsInterval);
        tabUpdatedHandler = null;
    }

    // Done this way so the correct "this" can still be accessed
    var checkTabs = () => {
        // A tab can be muted and still be "audible"
        chrome.tabs.query({
            muted: false,
            audible: true
        }, tabs => {
            let nowAudible = tabs.length > 0;
            if (nowAudible != this.audible) {
                callback(tabs.length > 0);
                this.audible = nowAudible;
            }
        });
    }
}
