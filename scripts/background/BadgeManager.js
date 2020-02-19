// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabledStart) {
	let isEnabled = isEnabledStart;
	let isTabAudible = false;
	let badgeText;
	let badgeIcon;

	this.updateEnabled = (enabled) => {
		printDebug("BadgeText has been set to", enabled);

		isEnabled = enabled;

		if (enabled) updateBadgeText();
		else updateBadgeText(true);
	}

	addEventListener("hourMusic", (hour, weather) => {
		badgeText = `${formatHour(hour)}`;
		if (!isTabAudible) {
			if (isEnabled) updateBadgeText();
			setIcon(weather);
		}
	});

	addEventListener("kkStart", () => {
		badgeText = "KK";
		if (isEnabled) updateBadgeText();
		setIcon('kk');
	});

	addEventListener("pause", tabPause => {
		if (tabPause) {
			isTabAudible = true;
			setBadgeText("ll");
		} else setBadgeText("");
		setIcon('paused');
	});

	addEventListener("unpause", () => {
		isTabAudible = false;
		if (isEnabled) setBadgeText(badgeText);
		if (badgeIcon) setIcon(badgeIcon);
	});

	addEventListener("musicFailed", () => {
		setBadgeText("x", [230, 0, 0, 255]);
	});

	addEventListener("gameChange", (hour, weather) => setIcon(weather));

	addEventListener("weatherChange", (hour, weather) => setIcon(weather));

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });

	function updateBadgeText(reset = false) {
		if (isTabAudible) return;

		printDebug("Updating BadgeText to", badgeText);

		let text = badgeText || "";
		if (reset) text = "";

		setBadgeText(text);
	}

	function setBadgeText(text, color = [57, 230, 0, 255]) {
		chrome.browserAction.setBadgeText({ text });
		chrome.browserAction.setBadgeBackgroundColor({ color });
	}

	function setIcon(icon) {
		if (icon != 'paused') badgeIcon = icon;

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
