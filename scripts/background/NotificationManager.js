// Handles notifications

'use strict';

function NotificationManager(addEventListener, isEnabled) {
	function doNotification(message, icon = 'clock') {
		const notificationOptions = {
				type: 'basic',
				title: 'Animal Crossing Music',
				iconUrl: `../img/${icon}.png`,
				message
		};
		
		// Silent notifications are not supported on Firefox or Safari
		if (navigator.userAgentData) notificationOptions.silent = true;
		
		chrome.notifications.create('animal-crossing-music', notificationOptions);
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
