// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {
	
	addEventListener("hourMusic", function(hour) {
		isEnabled() && chrome.browserAction.setBadgeText({ text: `${formatHour(hour)}m` });
		chrome.browserAction.setIcon({ path: 'img/icon_38_leaf_playing.png' });
	});

	addEventListener("kkStart", function() {
		isEnabled() && chrome.browserAction.setBadgeText({ text: "KK" });
		chrome.browserAction.setIcon({ path: 'img/icon_38_kk_playing.png' });
	});

	addEventListener("pause", function() {
		chrome.browserAction.setBadgeText({ text: "" });
		chrome.browserAction.setIcon({ path: 'img/icon_38_leaf_paused.png' });
	});
	
	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}
