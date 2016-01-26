// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {

	addEventListener("hourMusic", function(hour) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		}
		changeIcon(true, false);
	});

	addEventListener("kkStart", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "KK" });
		}
		changeIcon(true, true);
	});

	addEventListener("pause", function() {
		chrome.browserAction.setBadgeText({ text: "" });
		changeIcon(false, false);
	});
	
	function changeIcon(isPlaying, isKK) {
		if(isPlaying) {
			if(isKK) {
				chrome.browserAction.setIcon({
					path : "img/icon_38_kk.png"
				});
			} else {
				chrome.browserAction.setIcon({
					path : "img/icon_38_leaf-02.png"
				});
			}		
		}
		else {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-01.png"
		});
		}
	}

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}