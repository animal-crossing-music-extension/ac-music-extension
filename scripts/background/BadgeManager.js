// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {
	let pausedState = {};

	addEventListener("hourMusic", (hour, weather) => {
		isEnabled() && chrome.browserAction.setBadgeText({ text: `${formatHour(hour)}` });
		setIcon(weather);
	});

	addEventListener("kkStart", () => {
		isEnabled() && chrome.browserAction.setBadgeText({ text: "KK" });
		setIcon('kk');
	});

	addEventListener("pause", tabPause => {
		chrome.browserAction.getBadgeText({}, badgeText => {
			pausedState.badge = badgeText;
			if (tabPause) chrome.browserAction.setBadgeText({ text: "ll" });
			else chrome.browserAction.setBadgeText({ text: "" });
			setIcon('paused');
		});
	});

	addEventListener("unpause", () => {
		if (pausedState.badge) chrome.browserAction.setBadgeText({ text: pausedState.badge });
		if (pausedState.icon) setIcon(pausedState.icon);
	});

	addEventListener("gameChange", (hour, weather) => setIcon(weather));

	addEventListener("weatherChange", (hour, weather) => setIcon(weather));

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });

	function setIcon(icon) {
		if (icon != 'paused') pausedState.icon = icon;

		let path = {
			128: `img/icons/status/${icon}/128.png`,
			64: `img/icons/status/${icon}/64.png`,
			32: `img/icons/status/${icon}/32.png`,
		};

		if (icon == 'kk') {
			path = {
				128: `img/icons/kk/128.png`,
				64: `img/icons/kk/64.png`,
				32: `img/icons/kk/32.png`,
			};
		}
		
		chrome.browserAction.setIcon({ path });
	}
}
