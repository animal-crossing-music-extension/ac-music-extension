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
					path : "img/icon_38_kk_playing.png"
				});
			} else {
				chrome.browserAction.setIcon({
					path : "img/icon_38_leaf_playing.png"
				});
			}		
		}
		else {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf_paused.png"
		});
		}
	}

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}