// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {

	addEventListener("hourMusic", function(hour) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		}
	});
	
	addEventListener("weatherMusic", function(hour, music, weather) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: weather });
		}
	});

	addEventListener("kkStart", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "KK" });
		}
	});

	addEventListener("pause", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "" });
		}
	});
	

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}

function clearBadge() {
	chrome.browserAction.setBadgeText({ text: '' });
}

function updateWeather(weather) {
		chrome.browserAction.setBadgeText({ text: weather });
}

function setIcon(play) {
	if(play) {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-02.png"
		});
	}
	else {
		chrome.browserAction.setIcon({
			path : "img/icon_38_leaf-01.png"
		});
	}
}