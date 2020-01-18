// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {
	addEventListener("hourMusic", (hour, weather) => {
		isEnabled() && chrome.browserAction.setBadgeText({ text: `${formatHour(hour)}` });
		setIcon(weather);
	});

	addEventListener("kkStart", () => {
		isEnabled() && chrome.browserAction.setBadgeText({ text: "KK" });
		chrome.browserAction.setIcon({
			path: {
				128: `img/icons/kk/128.png`,
				64: `img/icons/kk/64.png`,
				32: `img/icons/kk/32.png`,
			}
		});
	});

	addEventListener("pause", () => {
		chrome.browserAction.setBadgeText({ text: "" });
		setIcon('paused');
	});

	addEventListener("gameChange", (hour, weather) => {
		setIcon(weather);
	});

	addEventListener("weatherChange", setIcon);

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });

	function setIcon(weather) {
		chrome.browserAction.setIcon({
			path: {
				128: `img/icons/status/${weather}/128.png`,
				64: `img/icons/status/${weather}/64.png`,
				32: `img/icons/status/${weather}/32.png`,
			}
		});
	}
}
