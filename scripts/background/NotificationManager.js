// Handles Chrome notifications

'use strict';

function NotificationManager(addEventListener, isEnabled) {
	function doNotification(message, icon = 'clock') {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			iconUrl: `../img/${icon}.png`,
			silent: true,
			message
		});
	}

	addEventListener("weatherChange", (hour, weather) => {
		isEnabled() && doNotification("It is now " + weather.toLowerCase());
	});

	addEventListener("hourMusic", (hour, weather) => {
		isEnabled() && doNotification(`It is now ${formatHour(hour)} and ${weather}`);
	});

	addEventListener("kkMusic", title => {
		isEnabled() && doNotification('K.K. Slider is now playing ' + title, 'kk');
	});
}
