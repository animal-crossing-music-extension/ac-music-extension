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

	addEventListener("weatherChange", weather => {
		if (isEnabled()) {
			let lowerWeather = weather.toLowerCase();
			doNotification(lowerWeather + (lowerWeather !== 'clear' ? 'ing' : ''));
		}
	});

	addEventListener("hourMusic", hour => {
		isEnabled() && doNotification(`It is now ${formatHour(hour)}`);
	});

	addEventListener("kkMusic", title => {
		isEnabled() && doNotification('K.K. Slider is now playing ' + title, 'icon_128_kk');
	});
}
