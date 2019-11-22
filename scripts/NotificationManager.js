// Handles Chrome notifications

'use strict';

function NotificationManager(addEventListener, isEnabled) {
	let weather;

	function doNotification (message) {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			iconUrl: '../img/clock.png',
			silent: true,
			message
		});
	}

	addEventListener("weatherChange", function(weather) {

		if (isEnabled()) {
			let lowerWeather = weather.toLowerCase();
			doNotification(lowerWeather + (lowerWeather !== 'clear' ? 'ing' : ''));
		}
	});
	
	addEventListener("hourMusic", function(hour) {
		isEnabled() && doNotification(`It is now ${formatHour(hour)}m`);
	});

	addEventListener("kkStart", function() {
		isEnabled() && doNotification('K.K. Slider has started to play!');
	});

}
