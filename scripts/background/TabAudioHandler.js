// Handles tabs playing audio

'use strict';

function TabAudioHandler() {

    let tabUpdatedHandler;
    let checkTabsInterval;
    let callback;
    let audible = false;

    this.activated = false;

    this.registerCallback = function (cb) {
        callback = cb;
    }

    this.activate = async function () {
        printDebug("Activating TabAudioHandler.");

        this.activated = true;
        let perms = await checkPerms();
        printDebug(perms);

        if (perms) {
            if (tabUpdatedHandler) removeHandler();
            tabUpdatedHandler = checkTabs;
            chrome.tabs.onUpdated.addListener(checkTabs);
            chrome.tabs.onRemoved.addListener(checkTabs); // A tab that is audible can be closed and will not trigger the updated event.
            checkTabsInterval = setInterval(checkTabs, 100);
            checkTabs();
        } else if (tabUpdatedHandler) removeHandler();
    }

    function checkPerms () {
        return new Promise(resolve => {
            chrome.permissions.contains({ permissions: ['tabs'] }, resolve);
        });
    }

    function removeHandler() {
        if (tabUpdatedHandler) chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
        if (checkTabsInterval) clearInterval(checkTabsInterval);
        tabUpdatedHandler = null;
    }

    function checkTabs() {
        // A tab can be muted and still be "audible"
        chrome.tabs.query({
            muted: false,
            audible: true
        }, tabs => {
            let nowAudible = tabs.length > 0;
            if (nowAudible != audible) {
                callback(tabs.length > 0);
                audible = nowAudible;
            }
        });
    }
}
