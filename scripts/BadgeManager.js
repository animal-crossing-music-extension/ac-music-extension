// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {

	addEventListener("hourMusic", function(hour) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		}
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-02.png"
		});
		playIcon();
	});
	
	addEventListener("weatherMusic", function(hour, music, weather) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: weather });
		}
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-02.png"
		});
		playIcon();
	});

	addEventListener("kkStart", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "KK" });
		}
		playIcon();
	});

	addEventListener("pause", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "" });
		}
		pauseIcon();
	});
	
	function pauseIcon() {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-01.png"
		});
	}
	
	function playIcon() {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-02.png"
		});
	}
	
	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}