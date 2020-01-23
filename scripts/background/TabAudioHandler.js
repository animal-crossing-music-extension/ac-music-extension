// Handles tabs playing audio

'use strict';

function TabAudioHandler() {

    let tabUpdatedHandler;
    let callback;

    this.registerCallback = function (cb) {
        callback = cb;
    }

    this.activate = async function () {
        let perms = await checkPerms();
        printDebug(perms);

        if (perms) {
            if (tabUpdatedHandler) removeHandler();
            tabUpdatedHandler = checkTabs;
            chrome.tabs.onUpdated.addListener(checkTabs);
            chrome.tabs.onRemoved.addListener(checkTabs); // A tab that is audible can be closed and will not trigger the updated event.
            checkTabs();
        } else if (tabUpdatedHandler) removeHandler();
    }

    function checkPerms () {
        return new Promise(resolve => {
            chrome.permissions.contains({ permissions: ['tabs'] }, resolve);
        });
    }

    function removeHandler() {
        chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
        tabUpdatedHandler = null;
    }

    function checkTabs() {
        // A tab can be muted and still be "audible"
        chrome.tabs.query({
            muted: false,
            audible: true
        }, tabs => {
            callback(tabs.length > 0);
        });
    }
}
