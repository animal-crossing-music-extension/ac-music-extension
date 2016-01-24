// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener) {

	addEventListener("hourMusic", function(hour) {
		chrome.browserAction.setBadgeText({ text: formatHour(hour) });
	});

	addEventListener("kkStart", function() {
		chrome.browserAction.setBadgeText({ text: "KK" });
	});

	addEventListener("pause", function() {
		chrome.browserAction.setBadgeText({ text: "" });
	});

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });

}